// bunny.d.ts
type PlayerJsInstance = {
  on: (event: string, cb: (data?: PlayerJsEventData) => void) => void;
  off: (event: string, cb: (data?: PlayerJsEventData) => void) => void;
  getDuration: (cb: (duration: number) => void) => void;
  getCurrentTime: (cb: (seconds: number) => void) => void;
  play: () => void;
  pause: () => void;
};

/** Data shape emitted by Bunny's `timeupdate` event */
type PlayerJsEventData = {
  seconds?: number;
  duration?: number;
  percent?: number;
};

/** Player.js constructor available on `window.playerjs` after the script loads */

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseBunnyPlayerOptions {
  videoId: string;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  /** Whether the lesson is already marked completed (prevents duplicate API calls) */
  videoCompleted: boolean;
}

export interface UseBunnyPlayerReturn {
  /** Attach this ref to the <iframe> element */
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** Direct access to the Player.js instance (for imperative control) */
  playerRef: React.MutableRefObject<PlayerJsInstance | null>;
  /** True once the `ready` event fires */
  isReady: boolean;
  /** Video duration in seconds once the player has loaded metadata */
  duration: number | null;
}

type PlayerJsEventData = {
  seconds?: number;
  duration?: number;
  percent?: number;
};

/** Player.js constructor available on `window.playerjs` after the script loads */
type PlayerJsConstructor = new (iframe: HTMLIFrameElement) => PlayerJsInstance;

declare global {
  interface Window {
    playerjs?: { Player: PlayerJsConstructor };
  }
}

export { PlayerJsEventData, PlayerJsConstructor, PlayerJsInstance };
