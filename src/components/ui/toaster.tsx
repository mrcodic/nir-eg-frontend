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
            className="fixed w-[400px] top-20 right-4 z-99999999! "
          >
            <div className="flex items-center h-[5px]! gap-2 ">
              {/* {title && <ToastTitle>{title}</ToastTitle>} */}
              <div className="size-7 rounded-lg flex justify-center items-center">
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
