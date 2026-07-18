import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    data: {
      status: 200,
      message: "Logged out Successful!",
    },
  });

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
