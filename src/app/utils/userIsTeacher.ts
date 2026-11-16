export async function userIsTeacher(): Promise<boolean> {
   return (await getUserRole()) === 'teacher';
}
