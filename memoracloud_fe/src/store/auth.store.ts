"use client";

import { RouteConfig } from "@/utils/routeConfig";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserResponse = {
  id?: number;
  mobile: string;
  role: string;
  roleUnqId: string;
  sub: string;
};

type AuthState = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  setUser: (user: UserResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          // Don't redirect if already on a public page (login, not-found, not-authorized)
          const isPublicPage =
            currentPath === RouteConfig.LOGIN_PAGE ||
            currentPath.startsWith("/shared/");
          if (!isPublicPage) {
            window.location.href = RouteConfig.LOGIN_PAGE;
          }
        }
      },
    }),
    {
      name: "auth-store",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) =>
          sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    },
  ),
);
