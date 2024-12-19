import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
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
        isAuthenticated: false,
        setAuth: (user: User, token: string) =>
          set((state) => {
            state.user = user;
            state.accessToken = token;
            state.isAuthenticated = true;
          }),
        clearAuth: () =>
          set((state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
          }),
      })),
      {
        name: "notion-auth-store",
      }
    )
  )
);
