import axios, { AxiosResponse } from "axios";

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL ?? "",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

import { useLoaderStore } from "@/store/loader.store";

apiServer.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    useLoaderStore.getState().showLoader();
  }
  return config;
}, (error) => {
  if (typeof window !== "undefined") {
    useLoaderStore.getState().hideLoader();
  }
  return Promise.reject(error);
});

apiServer.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof window !== "undefined") {
      useLoaderStore.getState().hideLoader();
    }
    return response.data;
  },
  (error) => {
    if (typeof window !== "undefined") {
      useLoaderStore.getState().hideLoader();
    }
    return Promise.reject(error);
  }
);
export type ApiResponse<T> = T;
export default apiServer;
