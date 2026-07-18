"use client";

import { SpinLoader } from "@/components";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect, useRef, useState } from "react";

import { useLoaderStore } from "@/store/loader.store";

// ─── Inner component that uses useSearchParams (must be inside Suspense) ─────

function PageTransitionInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeRequests } = useLoaderStore();

  // Start as `true` so the loader is shown immediately on refresh / initial load
  const [isTransitioning, setIsTransitioning] = useState(true);
  const prevRouteRef = useRef<string | null>(null);

  const currentRoute = `${pathname}?${searchParams.toString()}`;

  // ── Initial load / page refresh ─────────────────────────────────────────────
  useEffect(() => {
    // Hide the loader shortly after the component first mounts (hydration done)
    const initialTimer = setTimeout(() => {
      setIsTransitioning(false);
      // Record current route as baseline AFTER initial hide
      prevRouteRef.current = currentRoute;
    }, 800);

    return () => clearTimeout(initialTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once on mount only

  // ── Subsequent route changes ────────────────────────────────────────────────
  useEffect(() => {
    // Skip until the initial load phase is done (prevRouteRef not yet set)
    if (prevRouteRef.current === null) return;

    // Route actually changed
    if (prevRouteRef.current !== currentRoute) {
      prevRouteRef.current = currentRoute;

      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [currentRoute]);

  const isLoading = isTransitioning || activeRequests > 0;

  return (
    <>
      <SpinLoader visible={isLoading} />
      {children}
    </>
  );
}

// ─── Public provider wrapped in Suspense (required for useSearchParams) ──────

export default function PageTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <PageTransitionInner>{children}</PageTransitionInner>
    </Suspense>
  );
}
