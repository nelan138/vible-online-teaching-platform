import type { UserRecord } from '#shared/types/UserRecord';

export async function userSetupIsComplete(user?: UserRecord | null): Promise<boolean> {
   const profile = user === undefined ? await getUser() : user;

   return Boolean(
      profile &&
      typeof profile.name === 'string' &&
      profile.name.trim().length > 0 &&
      (profile.role === 'student' || profile.role === 'teacher')
   );
}
