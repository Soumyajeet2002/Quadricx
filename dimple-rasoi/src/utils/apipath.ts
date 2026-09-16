const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export const API_PATH = {
  GET_PUBLIC_KEY: `${BASE_URL}/crypto/public-key`,
  SUBMIT_CONTACT_FORM: `${BASE_URL}/forms/submit`,
  HEALTH_CHECK: `${BASE_URL}/health`,
};
