import { SignJWT, jwtVerify, JWTPayload, decodeJwt } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET!);

export async function signAccessToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256" })
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256" })
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

export function verifyAccessToken(token: string) {
  const payload = decodeJwt(token);
  return payload;
}


// Verify Refresh Token
export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload;
}
