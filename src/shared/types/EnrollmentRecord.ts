export interface EnrollmentRecord {
   studentId: string;
   courseId: string;
   status: 'pending' | 'approved' | 'rejected';
}
