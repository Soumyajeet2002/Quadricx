const getServerUrl = () => process.env.NEXT_PUBLIC_API_URL1 ?? "";
const NEXT_PUBLIC_API_URL1 = process.env.NEXT_PUBLIC_API_URL1;

export const API_PATH = {
  get LOGIN_EMAIL() {
    return `${getServerUrl()}/auth/login-email`;
  },
};
