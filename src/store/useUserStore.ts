import { STORAGE_VAR } from "@/constant";
import { getAccessToken, getCurrentUser, removeCurrentUser, revokeAllTokens, setAccessToken, setCurrentUser, setRefreshToken } from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  username: string | null;
  role: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar?: string | null;
}

interface UserStore {
  user: User;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: getCurrentUser() || {
        username: null,
        role: null,
        name: null,
        email: null,
        phone: null,
        avatar: null,
      },
      isAuthenticated: !!getAccessToken(),

      login: (user: User, accessToken: string, refreshToken: string) => {
        set({
          user: { ...user },
          isAuthenticated: true,
        });
        setAccessToken(accessToken || "");
        setRefreshToken(refreshToken || "");
        setCurrentUser(user);
      },

      logout: () => {
        set({
          user: {
            username: null,
            role: null,
            name: null,
            email: null,
            phone: null,
            avatar: null,
          },
          isAuthenticated: false,
        });
        revokeAllTokens();
        removeCurrentUser();
      },
    }),
    {
      name: STORAGE_VAR.User,
      storage: createJSONStorage(() => localStorage),
    }
  )
);