import { addUser as createUser } from '~/utils/user/addUser';
import { getUser as fetchUser } from '~/utils/user/getUser';

export const useUserStore = defineStore('user', () => {
   const user = ref<UserRecord | null>(null);
   let latestRequest: Promise<UserRecord | null> | undefined;

   async function getUser(): Promise<UserRecord | null> {
      const request = fetchUser();
      latestRequest = request;
      const [profile, error] = await tryCatch(request);

      if (request === latestRequest) user.value = profile;
      if (error) throw error;
      return profile;
   }

   async function addUser(input: Parameters<typeof createUser>[0]): Promise<UserRecord> {
      const profile = await createUser(input);
      latestRequest = undefined;
      user.value = profile;
      return profile;
   }

   return { user, getUser, addUser };
});
