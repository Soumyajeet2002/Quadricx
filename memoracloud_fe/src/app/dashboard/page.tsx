"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLE_DASHBOARD_PATH, UserRole } from "@/utils/constants";
import { useAuthStore } from "@/store/auth.store";
import { RouteConfig } from "@/utils/routeConfig";

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.replace(RouteConfig.MAIN_ROUTE);
      return;
    }
    const dashboardPath = ROLE_DASHBOARD_PATH[user.role as unknown as UserRole];

    if (!dashboardPath) {
      router.replace(RouteConfig.NOT_AUTHORIZED);
      return;
    }

    router.replace(dashboardPath);
  }, [user, router]);
}
