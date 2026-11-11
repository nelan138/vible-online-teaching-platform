import { createAuthClient } from '@neon/auth';
import { BetterAuthVanillaAdapter } from '@neon/auth/vanilla/adapters';

export default defineNuxtPlugin(() => {
   const config = useRuntimeConfig();

   return {
      provide: {
         auth: createAuthClient(config.public.neonAuthUrl, {
            adapter: BetterAuthVanillaAdapter(),
         }),
      },
   };
});
