declare module "vue-router" {
   interface RouteMeta {
      user: User;
   }
}

export default defineNuxtRouteMiddleware((to) => {
   to.meta.user = useUserStore().user;
});
