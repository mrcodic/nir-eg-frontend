"use client";
import { create } from "zustand";

export const payDataStore = create((set) => ({
  data: {},

  addPayData: (data) => {
    return set({ data: data });
  },
  removeAllPayData: () => set({ data: {} }),
}));
