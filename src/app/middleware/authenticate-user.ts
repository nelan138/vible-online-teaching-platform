import type { User } from "#shared/types/user";
import { user } from "~/data/temp/user";

declare module "vue-router" {
   interface RouteMeta {
      user: User;
   }
}

export default defineNuxtRouteMiddleware((to) => {
   // Mock the signed-in teacher until authentication is connected.
   to.meta.user = { ...user };
});
