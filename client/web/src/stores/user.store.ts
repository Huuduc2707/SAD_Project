import { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useUserStore = create(
  persist<{
    user: User | null;
  }>(
    (get, set) => {
      return {
        user: null,
      };
    },
    {
      name: "user-storage",
      storage: createJSONStorage(() => window?.localStorage),
    },
  ),
);
