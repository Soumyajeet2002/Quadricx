import { verifyAccessToken } from "@/lib/jwt";
import { postRequest } from "@/service";
import { API_PATH } from "@/utils/apiPath";
import { STATUS_CODE, STATUS_MESSAGE } from "@/utils/constants";
import { NextResponse } from "next/server";

interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}

export async function POST(req: Request) {
  try {
    const body: LoginRequest = await req.json();
    const backendRes = await postRequest<
      LoginRequest,
      ApiResponse<LoginResponse>
    >(API_PATH.LOGIN_EMAIL, body);

    const { status, data } = backendRes;

    if (status !== STATUS_CODE.SUCCESS && status !== STATUS_CODE.CREATED) {
      return NextResponse.json(
        { message: STATUS_MESSAGE.UNKNOWN_ERROR },
        { status: status },
      );
    }

    if (!data?.accessToken) {
      throw new Error(STATUS_MESSAGE.MISSING_BACKEND_RESPONSE);
    }

    const decodedToken = await verifyAccessToken(data.accessToken);
    const { sub: id, mobile: userId, role, roleUnqId } = decodedToken;

    const response = NextResponse.json(
      {
        status,
        message: "Login Successful",
        data: {
          id,
          userId,
          role,
          roleUnqId,
        },
      },
      {
        status: STATUS_CODE.SUCCESS,
      },
    );

    response.cookies.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    if (isApiError(err)) {
      let errorMessage = err.message;

      // Customize backend validation messages
      if (
        err.message === "email must be an email" ||
        err.message === "Invalid email or password"
      ) {
        errorMessage = "Invalid your credentials";
      }

      return NextResponse.json(
        {
          message: errorMessage,
        },
        {
          status: err.status,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : STATUS_MESSAGE.UNKNOWN_ERROR,
      },
      {
        status: STATUS_CODE.INTERNAL_ERROR,
      },
    );
  }
}
