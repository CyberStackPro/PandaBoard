import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, access_token: string, refresh_token: string) => void;
  clearAuth: () => void;
  // accessTokenExpires: Date | null;
  // refreshToken: string | null;
  // refreshTokenExpires: Date | null;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        setAuth: (user: User, access_token: string, refresh_token: string) =>
          set((state) => {
            state.user = user;
            state.accessToken = access_token;
            state.refreshToken = refresh_token;
            state.isAuthenticated = true;
          }),
        clearAuth: () =>
          set((state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
          }),
      })),
      {
        name: "panda-auth-store",
      }
    )
  )
);
