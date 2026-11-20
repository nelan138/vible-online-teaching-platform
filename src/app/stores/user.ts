import type { UserRecord } from '#shared/types/UserRecord';

export const useUserStore = defineStore('user', () => {
   const user = ref<UserRecord | null>(null);
   let latestRequest: Promise<UserRecord | null> | undefined;

   async function load(): Promise<UserRecord | null> {
      const request = getUser();
      latestRequest = request;
      const [profile, error] = await tryCatch(request);

      if (request === latestRequest) user.value = profile;
      if (error) throw error;
      return profile;
   }

   return { user, load };
});
