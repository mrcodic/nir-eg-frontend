import { create } from "zustand";

type VideoPlayerStore = {
  currentTime: number;
  isPlaying: boolean;
  // The active player's pause fn — set by whichever hook is mounted
  _pauseFn: (() => void) | null;

  // Written by the hook
  setCurrentTime: (t: number) => void;
  setIsPlaying: (v: boolean) => void;
  registerPause: (fn: () => void) => void;
  unregisterPause: () => void;

  // Called by any component
  pause: () => void;
};

export const useVideoPlayerStore = create<VideoPlayerStore>((set, get) => ({
  currentTime: 0,
  isPlaying: false,
  _pauseFn: null,

  setCurrentTime: (t) => set({ currentTime: t }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  registerPause: (fn) => set({ _pauseFn: fn }),
  unregisterPause: () => set({ _pauseFn: null }),

  pause: () => get()._pauseFn?.(),
}));
