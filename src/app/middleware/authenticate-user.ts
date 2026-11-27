import type { User } from "#shared/types/user";
import { teacher } from "~/data/temp/user";

declare module "vue-router" {
   interface RouteMeta {
      user: User;
   }
}

export default defineNuxtRouteMiddleware((to) => {
   const user = useState<User>("mock-user", () => ({ ...teacher }));
   to.meta.user = user.value;
});
