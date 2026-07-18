import { RouteConfig } from "./routeConfig";

export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  DUPLICATE_ENTRY: 409,
} as const;

export const STATUS_MESSAGE = {
  SUCCESSFUL: "Successful!",
  FAILED: "Failed!",
  UNKNOWN_ERROR: "An unexpected internal server error occurred",
  MISSING_BACKEND_RESPONSE: "Missing required data in backend response.",
  ACCESS_DENIED: "Access Denied",
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  PHOTO_GRAPHER: 3,
  CUSTOMER: 4,
} as const;

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  [USER_ROLES.SUPER_ADMIN]: RouteConfig.DASHBOARD_ADMIN,
  [USER_ROLES.ADMIN]: RouteConfig.DASHBOARD_ADMIN,
  [USER_ROLES.PHOTO_GRAPHER]: RouteConfig.DASHBOARD_PHOTOGRAPHER,
  [USER_ROLES.CUSTOMER]: RouteConfig.DASHBOARD_CUSTOMER,
};

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
