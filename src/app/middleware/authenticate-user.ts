import { teacher } from "~/data/temp/user";

declare module "vue-router" {
   interface RouteMeta {
      user: User;
   }
}

export default defineNuxtRouteMiddleware((to) => {
   to.meta.user = useState<User>("debug-user", () => teacher).value;
});
