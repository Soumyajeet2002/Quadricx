"use client";

import { create } from "zustand";

type LoaderState = {
  activeRequests: number;
  showLoader: () => void;
  hideLoader: () => void;
};

export const useLoaderStore = create<LoaderState>((set) => ({
  activeRequests: 0,
  showLoader: () =>
    set((state) => ({ activeRequests: state.activeRequests + 1 })),
  hideLoader: () =>
    set((state) => ({
      activeRequests: Math.max(0, state.activeRequests - 1),
    })),
}));
