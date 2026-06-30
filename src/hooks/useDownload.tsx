'use client';

import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

const DOWNLOAD_LOADING_TOAST_ID = 'download-loading';

export const useDownload = () => {
  const showLoadingToast = useCallback((progress = 0) => {
    const safeProgress = Math.max(0, Math.min(100, Math.round(progress || 0)));

    toast.loading(
      <div className="flex items-center gap-3 w-full">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#2E77AE] border-t-transparent shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[15px] font-bold text-[#222]">
            جاري التحميل
          </span>

          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#2E77AE] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${safeProgress}%` }}
            />
          </div>

          <span className="text-[12px] text-[#666]">{safeProgress}%</span>
        </div>
      </div>,
      {
        id: DOWNLOAD_LOADING_TOAST_ID,
        duration: Infinity,
        unstyled: true,
        icon: null,
        classNames: {
          toast:
            '!w-[350px] !rounded-[10px] !border !border-[#D9B45C] !bg-[#f4efea] !px-4 !py-3 !shadow-md',
        },
      }
    );
  }, []);

  const dismissLoadingToast = useCallback(() => {
    toast.dismiss(DOWNLOAD_LOADING_TOAST_ID);
  }, []);

  const startDownload = useCallback(
    (url: string) => {
      if (typeof window === 'undefined' || !window.electron) return;

      showLoadingToast(0);
      window.electron.downloadFile(url);
    },
    [showLoadingToast]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.electron) return;

    window.electron.onDownloadProgress(({ progress }: { progress: number }) => {
      showLoadingToast(progress);
    });

    window.electron.onDownloadDone(
      ({ fileName, savePath }: { fileName?: string; savePath: string }) => {
        dismissLoadingToast();

        toast.success('تم التحميل بنجاح', {
          id: `download-success-${Date.now()}`,
          closeButton: true,
          duration: 6000,
          icon: (
            <img
              src="/assets/CorrectColor.svg"
              alt="success"
              className="h-7 w-7 object-contain"
            />
          ),
          description: (
            <button
              type="button"
              onClick={() => window.electron?.showInFolder(savePath)}
              className="text-[14px] font-bold text-[#523412] underline text-right mt-1 cursor-pointer"
            >
              عرض في المجلد
            </button>
          ),
          classNames: {
            toast:
              '!relative !w-[350px] !rounded-[10px] !border !border-[#10b981] !bg-[#f4efea] !px-16 !py-4 !shadow-none !flex !flex-col !gap-2',
            content: '!flex !w-full !flex-col !gap-2',
            title:
              '!w-full !text-[15px] !font-bold !leading-[1.2] !text-[#222222]',
            description: '!mt-1 !w-full !text-[13px] !text-[#666666]',
            icon: '!absolute !right-4 !top-1/2 !m-0 !size-7 !-translate-y-1/2',
            closeButton:
              '!absolute !left-4 !right-auto !top-1/2 !m-0 !size-7 !-translate-y-1/2 !rounded-full !border-0 !bg-transparent !p-0 !text-[#4a4a4a] !shadow-none hover:!bg-transparent',
          },
        });
      }
    );

    window.electron.onDownloadError(
      ({ message }: { message?: string } = {}) => {
        dismissLoadingToast();

        toast.error(message || 'فشل التحميل', {
          id: `download-error-${Date.now()}`,
          closeButton: true,
          duration: 6000,
          icon: (
            <img
              src="/assets/WarningColor.svg"
              alt="error"
              className="h-7 w-7 object-contain"
            />
          ),
          classNames: {
            toast:
              '!relative !w-[350px] !rounded-[10px] !border !border-[#f59e0b] !bg-[#f4efea] !px-16 !py-4 !shadow-none !flex !items-center',
            content: '!flex !w-full !items-center',
            title:
              '!w-full !text-[15px] !font-bold !leading-[1.2] !text-[#222222]',
            icon: '!absolute !right-4 !top-1/2 !m-0 !size-7 !-translate-y-1/2',
            closeButton:
              '!absolute !left-4 !right-auto !top-1/2 !m-0 !size-7 !-translate-y-1/2 !rounded-full !border-0 !bg-transparent !p-0 !text-[#4a4a4a] !shadow-none hover:!bg-transparent',
          },
        });
      }
    );

    return () => {
      dismissLoadingToast();
      window.electron?.removeDownloadListeners?.();
    };
  }, [dismissLoadingToast, showLoadingToast]);

  return { startDownload };
};
