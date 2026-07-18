"use client";

import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import apiServer from "./service/axios-server";
import { useTokenRefresh } from "./hooks/useTokenRefresh";

export default function AuthHydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s: any) => s.setUser);
  const logout = useAuthStore((s: any) => s.logout);
  const { scheduleRefresh } = useTokenRefresh();

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const res = await apiServer.get("/api/auth/session");
        if (!mounted) return;
        setUser(res.data.user);
        // Start the refresh timer after session is loaded
        scheduleRefresh();
      } catch {
        if (!mounted) return;
        logout();
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, [setUser, logout, scheduleRefresh]);

  return <>{children}</>;
}
