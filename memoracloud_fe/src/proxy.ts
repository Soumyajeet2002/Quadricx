import { verifyAccessToken } from "@/lib/jwt";
import { USER_ROLES } from "@/utils/constants";
import { RouteConfig } from "@/utils/routeConfig";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const pathname = req.nextUrl.pathname;

  /* -------------------- AUTH CHECK -------------------- */

  if (!token) {
    return NextResponse.redirect(new URL(RouteConfig.LOGIN_PAGE, req.url));
  }

  try {
    const payload = await verifyAccessToken(token);

    const role = payload.role;

    /* -------------------- PUBLIC AUTH ROUTES -------------------- */

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return NextResponse.next();
    }

    /* -------------------- ADMIN ROUTES -------------------- */

    const ADMIN_ROUTES = [
      "/dashboard",
      "/user-management",
      "/project-management",
    ];

    const isAdminRoute = ADMIN_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (isAdminRoute) {
      if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.SUPER_ADMIN) {
        return NextResponse.redirect(
          new URL(RouteConfig.NOT_AUTHORIZED, req.url),
        );
      }
    }

    /* -------------------- SUPER ADMIN ONLY -------------------- */

    if (pathname.startsWith("/user-management")) {
      if (role !== USER_ROLES.SUPER_ADMIN) {
        return NextResponse.redirect(
          new URL(RouteConfig.NOT_AUTHORIZED, req.url),
        );
      }
    }

    /* -------------------- PHOTOGRAPHER ROUTES -------------------- */

    if (pathname.startsWith("/dashboard/photographer")) {
      if (role !== USER_ROLES.PHOTO_GRAPHER) {
        return NextResponse.redirect(
          new URL(RouteConfig.NOT_AUTHORIZED, req.url),
        );
      }
    }

    /* -------------------- CUSTOMER ROUTES -------------------- */

    if (pathname.startsWith("/dashboard/customer")) {
      if (role !== USER_ROLES.CUSTOMER) {
        return NextResponse.redirect(
          new URL(RouteConfig.NOT_AUTHORIZED, req.url),
        );
      }
    }

    /* -------------------- SUCCESS -------------------- */

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy Authentication Error:", error);

    return NextResponse.redirect(new URL(RouteConfig.LOGIN_PAGE, req.url));
  }
}

/* -------------------- MIDDLEWARE MATCHER -------------------- */

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user-management/:path*",
    "/project-management/:path*",
    "/shared/:path*",
  ],
};
