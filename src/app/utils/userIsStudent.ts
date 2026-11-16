export async function userIsStudent(): Promise<boolean> {
   return (await getUserRole()) === 'student';
}
