export {};

declare global {
  interface Window {
    electron?: {
      platform: string;

      openPayment: (url: string) => void;
      downloadFile: (url: string) => void;
      showInFolder: (filePath: string) => void;

      onDownloadProgress: (
        cb: (data: { progress: number; fileName: string }) => void,
      ) => void;

      onDownloadDone: (
        cb: (data: { fileName: string }) => void,
      ) => void;

      onDownloadError: (
        cb: (data: { fileName: string }) => void,
      ) => void;

      removeDownloadListeners: () => void;

      savePDF: (buffer: ArrayBuffer, fileName: string) => void;

      onUpdateAvailable: (cb: (info: unknown) => void) => () => void;
      onUpdateDownloaded: (cb: (info: unknown) => void) => () => void;
      installUpdate: () => void;

      loginComplete: (data: {
        sanctumToken: string;
        userId: number;
      }) => void;

      desktopLogout: () => Promise<{ ok: boolean; error?: string }>;

      saveUserPhone: (data: {
        phone: string;
        phone_code?: string;
      }) => Promise<{ ok: boolean }>;

      getUserPhone: () => Promise<{
        phone: string;
        phone_code: string;
      }>;
    };
  }
}