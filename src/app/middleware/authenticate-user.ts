export default defineNuxtRouteMiddleware(async () => {
   if (import.meta.server) return;

   const [user, loadError] = await tryCatch(useUserStore().load());
   if (loadError) throw createError({ statusCode: 503, statusMessage: 'Could not verify your account' });

   if (!user) {
      const [loggedIn, logInError] = await tryCatch(userIsLoggedIn());
      if (logInError) throw createError({ statusCode: 503, statusMessage: 'Could not verify your session' });
      if (!loggedIn) return navigateTo('/account/login');
   }

   if (!(await userSetupIsComplete(user))) return navigateTo('/user/setup');
});
