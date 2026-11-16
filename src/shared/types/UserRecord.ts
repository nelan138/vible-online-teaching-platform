export interface UserRecord {
   id: string; // UUIDs are strings in TypeScript
   name: string;
   role: 'student' | 'teacher';
}
