declare global {
  interface Window {
    VdoPlayer?: {
      getInstance: (iframe: HTMLIFrameElement | null) => VdoInstance | null;
    };
    onVdoPlayerV2APIReady?: () => void;
  }
}

export {};
