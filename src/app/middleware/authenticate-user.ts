export default defineNuxtRouteMiddleware(async () => {
   if (import.meta.server) return;

   const [loggedIn, logInError] = await tryCatch(userIsLoggedIn());

   if (logInError) throw createError({ statusCode: 503, statusMessage: 'Could not verify your session' });

   if (!loggedIn) return navigateTo('/account/login');

   const [setUp, setUpError] = await tryCatch(userSetupIsComplete());

   if (setUpError) throw createError({ statusCode: 503, statusMessage: 'Could not verify your account setup' });

   if (!setUp) return navigateTo('/user/setup');
});
