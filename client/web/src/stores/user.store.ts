import { baseApi } from "@/apis/base";
import { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create(
  persist<{
    user: User | null;
    isReady: boolean;
    token: string | null;
    login(token: string, user: User): void;
    logout(): void;
  }>(
    (set, get) => {
      return {
        user: null,
        isReady: false,
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
        // if (state.token) {
        //   baseApi.token = state.token;
        //   userApi
        //     .getCurrentUser()
        //     .then((user) => {
        //       useUserStore.setState({ ...state, user });
        //     })
        //     .catch((err) => {
        //       useUserStore.setState({ ...state, user: null, token: null });
        //     })
        //     .finally(() => {
        //       useUserStore.setState({ ...state, isReady: true });
        //     });
        // } else {
        //   useUserStore.setState({ ...state, isReady: true });
        // }
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
