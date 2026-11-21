import { randomUUID } from 'node:crypto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { H3Event } from 'h3';
import { imageMeta } from 'image-meta';
import mime from 'mime';
import { DatabaseError } from 'pg';
import insertFileContent from '#server/sql/content/insertFileContent.sql';
import selectContentByContentId from '#server/sql/content/selectContentByContentId.sql';
import { useDatabase } from '#server/utils/db';
import type { FileContentRecord } from '#shared/types/FileContentRecord';
import type { FileRecord } from '#shared/types/FileRecord';
import { tryCatch } from '#shared/utils/tryCatch';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const bucket = 'vible-files';
const maxFileSize = 10 * 1024 * 1024;
const maxRequestSize = maxFileSize + 64 * 1024;
const fileTooLarge = { statusCode: 413, statusMessage: 'File exceeds the 10 MiB upload limit' };
let storageClient: S3Client | undefined;

function getStorageClient(): S3Client {
   if (storageClient) return storageClient;

   const { AWS_ENDPOINT_URL_S3, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
   if (!AWS_ENDPOINT_URL_S3 || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw createError({ statusCode: 503, statusMessage: 'File storage is not configured' });
   }

   storageClient = new S3Client({
      endpoint: AWS_ENDPOINT_URL_S3,
      region: AWS_REGION,
      credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
      forcePathStyle: true,
   });
   return storageClient;
}

async function readUpload(event: H3Event): Promise<File> {
   const contentType = getHeader(event, 'content-type');
   if (!contentType || !/^multipart\/form-data(?:\s*;|$)/i.test(contentType)) {
      throw createError({ statusCode: 415, statusMessage: 'Expected multipart form data' });
   }

   if (Number(getHeader(event, 'content-length')) > maxRequestSize) throw createError(fileTooLarge);

   const chunks: Buffer[] = [];
   let bodySize = 0;
   for await (const chunk of event.node.req.iterator({ destroyOnReturn: false })) {
      bodySize += chunk.length;
      if (bodySize > maxRequestSize) {
         setResponseHeader(event, 'Connection', 'close');
         throw createError(fileTooLarge);
      }
      chunks.push(chunk);
   }

   const body = new Response(Buffer.concat(chunks, bodySize), { headers: { 'content-type': contentType } });
   const [form, parseError] = await tryCatch(body.formData());
   if (parseError) throw createError({ statusCode: 400, statusMessage: 'Invalid multipart form data' });

   const [file, extra] = form.getAll('file');
   if (!(file instanceof File) || extra !== undefined || !file.name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Provide exactly one file' });
   }
   if (file.size > maxFileSize) throw createError(fileTooLarge);

   return file;
}

function getFileMimeType(name: string, body: Buffer): string {
   const mimeType = mime.getType(name);

   if (mimeType === 'application/pdf' && /^%PDF-\d\.\d/.test(body.toString('ascii', 0, 8))) {
      return mimeType;
   }

   if (mimeType === 'application/zip' && body.length >= 22) {
      const signature = body.readUInt32LE(0);
      if (signature === 0x04034b50 || signature === 0x06054b50) return mimeType;
   }

   if (mimeType === 'image/svg+xml') {
      const svg = body.toString('utf8').replace(/<!--[\s\S]*?-->/g, '').trim();
      if (/^(?:<\?xml\b[^?]*\?>\s*)?(?:<!DOCTYPE\s+svg\b[^>]*>\s*)?<svg[\s/>]/.test(svg)
         && /(?:\/>|<\/svg\s*>)$/.test(svg)) return mimeType;
   } else if (mimeType?.startsWith('image/')) {
      try {
         const { type } = imageMeta(body);
         if (type && mime.getType(type) === mimeType) return mimeType;
      } catch {
         // Invalid or unrecognized images receive the same response as unsupported file types.
      }
   }

   throw createError({ statusCode: 415, statusMessage: 'Only PDFs, images, and ZIP archives are accepted' });
}

export default defineEventHandler(async (event): Promise<FileRecord> => {
   const teacherId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');
   const courseId = getRouterParam(event, 'courseId');
   const contentId = getRouterParam(event, 'contentId');

   if (!requestedUserId || !uuidPattern.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }
   if (requestedUserId.toLowerCase() !== teacherId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot add files for another user' });
   }
   if (!courseId || !uuidPattern.test(courseId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' });
   }
   if (!contentId || !uuidPattern.test(contentId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid content ID' });
   }

   const contentParams = [contentId, courseId, teacherId];
   const [content, lookupError] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<{ id: string }>(selectContentByContentId, contentParams))
   );
   if (lookupError) throw createError({ statusCode: 503, statusMessage: 'Could not check content ownership' });

   const [target] = content.rows;
   if (!target) throw createError({ statusCode: 404, statusMessage: 'Content not found' });

   const file = await readUpload(event);
   const body = Buffer.from(await file.arrayBuffer());
   const record: FileRecord = {
      id: `content/${target.id}/${randomUUID()}`,
      name: file.name,
      mimeType: getFileMimeType(file.name, body),
      sizeBytes: String(file.size),
   };
   const storage = getStorageClient();
   const object = { Bucket: bucket, Key: record.id };

   const [, uploadError] = await tryCatch(storage.send(new PutObjectCommand({
      ...object,
      Body: body,
      ContentType: record.mimeType,
   })));
   if (uploadError) throw createError({ statusCode: 503, statusMessage: 'Could not upload the file' });

   const [inserted, insertError] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<FileContentRecord>(insertFileContent, [
         ...contentParams, record.id, record.name, record.mimeType, record.sizeBytes,
      ]))
   );

   if (!inserted?.rows[0]) {
      // A lost database connection can leave the commit outcome unknown.
      if (!insertError || (insertError instanceof DatabaseError && insertError.severity === 'ERROR')) {
         await storage.send(new DeleteObjectCommand(object)).catch(() => {
            console.error('Could not remove unlinked upload', record.id);
         });
      } else {
         console.error('Could not confirm attachment metadata for upload', record.id);
      }

      if (insertError) throw createError({ statusCode: 503, statusMessage: 'Could not save the attachment' });
      throw createError({ statusCode: 404, statusMessage: 'Content not found' });
   }

   setResponseStatus(event, 201);
   return record;
});
