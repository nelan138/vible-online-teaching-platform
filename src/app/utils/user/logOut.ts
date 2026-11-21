export async function logOut() {
   const auth = useAuth();
   const toast = useToast();
   const [result, requestError] = await tryCatch(auth.signOut());
   const error = requestError ?? result?.error;

   if (error) {
      toast.add({
         title: 'Could not log out',
         description: error.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   // Reload the app to discard account data held in client stores.
   return navigateTo('/account/login', { external: true, replace: true });
}
