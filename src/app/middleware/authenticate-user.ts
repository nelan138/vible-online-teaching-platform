import type { User } from "#shared/types/user";

declare module "vue-router" {
   interface RouteMeta {
      user: User;
   }
}

export default defineNuxtRouteMiddleware((to) => {
   // Mock the signed-in teacher until authentication is connected.
   to.meta.user = { id: "1", name: "Maya Chen", role: "teacher" };
});
