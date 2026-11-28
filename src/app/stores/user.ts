import { student, teacher } from "~/data/temp/user";

export const useUserStore = defineStore("user", {
   state: () => ({
      user: { ...teacher },
   }),
   actions: {
      switchUser() {
         this.user = { ...(this.user.role === "teacher" ? student : teacher) };
      },
   },
});
