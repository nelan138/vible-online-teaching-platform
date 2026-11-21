export default defineNuxtRouteMiddleware(async () => {
   if (import.meta.server) return;

   const [user, loadError] = await tryCatch(useUserStore().getUser());
   if (loadError) throw createError({ statusCode: 503, statusMessage: 'Could not verify your account', fatal: true });

   if (!user) {
      const [loggedIn, logInError] = await tryCatch(userIsLoggedIn());
      if (logInError) throw createError({ statusCode: 503, statusMessage: 'Could not verify your session', fatal: true });
      if (!loggedIn) return navigateTo('/account/login');
   }

   if (!(await accountIsSetup(user))) return navigateTo('/account/setup');
});
