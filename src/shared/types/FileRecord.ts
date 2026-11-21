export interface FileRecord {
   id: string; // Object storage key
   name: string;
   mimeType: string;
   sizeBytes: string; // pg returns BIGINT as a string
}
