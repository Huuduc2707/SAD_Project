import { baseApi } from "@/apis/base";
import { userApi } from "@/apis/user";
import { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create(
  persist<{
    user: User | null;
    token: string | null;
    login(token: string, user: User): void;
    logout(): void;
  }>(
    (set, get) => {
      return {
        user: null,
        token: null,
        login(token, user) {
          set({ token, user });
        },
        logout() {
          set({ token: null, user: null });
        },
      };
    },
    {
      name: "user-storage",
      storage: createJSONStorage(() => window?.localStorage),
      onRehydrateStorage(state) {
        console.log("onRehydrateStorage", state);
        if (state.token) {
          baseApi.token = state.token;
          userApi
            .getCurrentUser()
            .then((user) => {
              useUserStore.setState({ user });
            })
            .catch((err) => {
              useUserStore.setState({ user: null, token: null });
            });
        }
      },
      skipHydration: true,
    },
  ),
);

useUserStore.subscribe((state) => {
  if (state.token) {
    baseApi.token = state.token;
  }
});
