import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET() {
  try {
    console.log("Welcome to Auth Hydrator SSR");
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    return NextResponse.json({
      data: {
        authenticated: true,
        user: {
          id: payload.sub,
          userId: payload.mobile,
          role: payload.role,
          roleUnqId: payload.roleUnqId,
          name: "",
        },
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
