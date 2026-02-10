/* eslint-disable react-hooks/immutability */
"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function Toaster() {
  const { toasts } = useToast();
  let path = "";

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        status,
        icon = "",
        ...props
      }) {
        switch (icon) {
          case "info":
            path = "/icons/State Info.svg";
            break;
          case "success":
            path = "/assets/notfSuccess.svg";
            break;
          case "error":
            path = "/assets/notfError.svg";
            break;
          case "delete":
            path = "/icons/State Delete.svg";
            break;
          default:
            path = "/icons/State Info.svg";
            break;
        }
        return (
          <Toast
            key={id}
            {...props}
            data-toast=""
            className="fixed top-20 right-0.5 z-99999999! w-[400px] max-w-[100vw] sm:right-4"
          >
            <div className="flex h-[5px]! items-center gap-2">
              {/* {title && <ToastTitle>{title}</ToastTitle>} */}
              <div className="flex size-7 items-center justify-center rounded-lg">
                <Image src={path} alt="" width={24} height={24} />
              </div>

              {(description || status) && (
                <ToastDescription>
                  {status == 411 ? "reCAPTCHA token is required " : description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
