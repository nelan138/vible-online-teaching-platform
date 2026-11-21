export interface ContentRecord {
   id: string;
   courseId: string;
   title: string;
   description: string | null;
   createdAt: string; // ISO 8601 timestamp used by the API
}
