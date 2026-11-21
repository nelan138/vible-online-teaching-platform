import { randomUUID } from 'node:crypto';
import insertContent from '#server/sql/content/insertContent.sql';

type ContentRow = Omit<ContentRecord, 'createdAt'> & { createdAt: Date };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event): Promise<ContentRecord> => {
   const teacherId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');
   const courseId = getRouterParam(event, 'courseId');

   if (!requestedUserId || !uuidPattern.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== teacherId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot add course content for another user' });
   }

   if (!courseId || !uuidPattern.test(courseId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' });
   }

   const body = await readBody<Partial<Pick<ContentRecord, 'title' | 'description'>> | null>(event);
   const title = typeof body?.title === 'string' ? body.title.trim() : '';
   const description = body?.description ?? null;

   if (!title) {
      throw createError({ statusCode: 400, statusMessage: 'Content title is required' });
   }

   if (description !== null && typeof description !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Description must be text or null' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<ContentRow>(
         insertContent, [courseId, teacherId, randomUUID(), title, description]
      ))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not create course content' });
   }

   const [content] = result.rows;
   if (!content) {
      throw createError({ statusCode: 404, statusMessage: 'Course not found' });
   }

   setResponseStatus(event, 201);
   return { ...content, createdAt: content.createdAt.toISOString() };
});
