import { API_PATH } from "@/utils/apiPath";
import { RouteConfig } from "@/utils/routeConfig";
import axios from "axios";

const api = axios.create({
  timeout: 20000,
});

import { useLoaderStore } from "@/store/loader.store";

// SKIP TOKEN ENDPOINTS
const SKIP_TOKEN_ENDPOINTS = [API_PATH.LOGIN_EMAIL];

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  // Show loader for all requests
  if (typeof window !== "undefined") {
    useLoaderStore.getState().showLoader();
  }

  const isSkip = SKIP_TOKEN_ENDPOINTS.some((url) => config.url?.includes(url));

  if (!isSkip && typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  if (typeof window !== "undefined") {
    useLoaderStore.getState().hideLoader();
  }
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      useLoaderStore.getState().hideLoader();
    }
    return response.data;
  },

  (error) => {
    if (typeof window !== "undefined") {
      useLoaderStore.getState().hideLoader();
    }
    // This block now *only* handles true physical HTTP errors (network issues, 404/500 *headers*)
    const err = error.response?.data ?? {};

    if (error.response?.status === 401) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== RouteConfig.LOGIN_PAGE
      ) {
        window.location.href = RouteConfig.LOGIN_PAGE;
      }
    }

    // Reject here so calling code can catch these specific *physical* errors
    return Promise.reject({
      status: err.status || error.response?.status || 500,
      message:
        err.message || error.message || "Unknown error (Network/Server Down)",
      data: err.data ?? null,
    });
  },
);

export default api;
