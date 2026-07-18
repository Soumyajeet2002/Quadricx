"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import apiServer from "@/service/axios-server";

/**
 * Reads the accessToken cookie from the browser.
 */
function getAccessTokenFromCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
}

/**
 * Decodes JWT payload without verification (only needs the `exp` claim).
 * Safe to do client-side — no secret needed.
 */
function decodeJwtExp(token: string): number | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/** Buffer in seconds before actual expiry to trigger refresh */
const REFRESH_BUFFER_SECONDS = 60;

/**
 * Custom hook that proactively refreshes the access token
 * ~1 minute before it expires.
 *
 * - Decodes the JWT `exp` claim from the accessToken cookie
 * - Sets a timer to call `/api/auth/refresh` before expiry
 * - On success, reschedules the next refresh with the new token
 * - On failure (refresh token expired), logs the user out
 */
export function useTokenRefresh() {
  const logout = useAuthStore((s) => s.logout);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleRef = useRef<(() => void) | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(() => {
    clearTimer();

    const token = getAccessTokenFromCookie();
    if (!token) return;

    const exp = decodeJwtExp(token);
    if (!exp) return;

    // Calculate ms until we should refresh (1 min before expiry)
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const refreshAtSeconds = exp - REFRESH_BUFFER_SECONDS;
    const delayMs = (refreshAtSeconds - nowInSeconds) * 1000;

    // If token is already expired or about to expire, refresh immediately
    const finalDelay = Math.max(delayMs, 0);

    console.log(
      `[TokenRefresh] Scheduled in ${Math.round(finalDelay / 1000)}s (token expires in ${exp - nowInSeconds}s)`,
    );

    timerRef.current = setTimeout(async () => {
      try {
        console.log("[TokenRefresh] Refreshing token...");
        const res = (await apiServer.get("/api/auth/refresh")) as unknown as {
          ok: boolean;
        };

        if (res?.ok) {
          console.log("[TokenRefresh] Token refreshed successfully");
          // New cookies are set by the server route — schedule the next refresh
          scheduleRef.current?.();
        } else {
          console.warn("[TokenRefresh] Refresh failed, logging out");
          logout();
        }
      } catch (error) {
        console.error("[TokenRefresh] Refresh error:", error);
        logout();
      }
    }, finalDelay);
  }, [clearTimer, logout]);

  // Keep scheduleRef in sync so the recursive call always uses the latest version
  useEffect(() => {
    scheduleRef.current = scheduleRefresh;
  }, [scheduleRefresh]);

  useEffect(() => {
    scheduleRefresh();
    return clearTimer;
  }, [scheduleRefresh, clearTimer]);

  return { scheduleRefresh };
}
