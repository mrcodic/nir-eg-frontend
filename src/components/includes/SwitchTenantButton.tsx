"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  clearSelectedDesktopTenant,
  navigateToDesktopEntry,
} from "@/helpers/fetchers/desktop-tenant-session";
import { cn } from "@/lib/utils";
import useLogout from "@/modules/auth/hooks/useLogout";

type SwitchTenantButtonProps = {
  logoutOnSwitch?: boolean;
  className?: string;
  label?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "outline-primary"
    | "outline-gray"
    | "secondary"
    | "ghost"
    | "link";
};

function showImmediateAppLoader(message = "جارٍ تغيير المنصة...") {
  if (typeof window === "undefined") return;

  if (document.getElementById("app-immediate-loader")) return;

  const style = document.createElement("style");
  style.id = "app-immediate-loader-style";
  style.innerHTML = `
    @keyframes appLoaderSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  const loader = document.createElement("div");
  loader.id = "app-immediate-loader";
  loader.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      z-index: 999999999;
      background: rgba(255,255,255,0.96);
      display: flex;
      align-items: center;
      justify-content: center;
      direction: rtl;
      font-family: inherit;
    ">
      <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:16px;">
        <div style="
          width:56px;
          height:56px;
          border-radius:9999px;
          border:4px solid #e5e7eb;
          border-top-color:#2563eb;
          animation: appLoaderSpin 0.8s linear infinite;
        "></div>

        <div>
          <div style="font-size:16px; font-weight:700; color:#1f2937;">
            ${message}
          </div>
          <div style="font-size:14px; color:#6b7280; margin-top:6px;">
            برجاء الانتظار لحظات
          </div>
        </div>
      </div>
    </div>
  `;

  document.head.appendChild(style);
  document.body.appendChild(loader);
}

function removeImmediateAppLoader() {
  if (typeof window === "undefined") return;

  document.getElementById("app-immediate-loader")?.remove();
  document.getElementById("app-immediate-loader-style")?.remove();
}

function isElectronDesktop() {
  return typeof window !== "undefined" && !!window.electron?.desktopLogout;
}

export default function SwitchTenantButton({
  logoutOnSwitch = false,
  className,
  label = "تغيير المنصة",
  variant = "outline-primary",
}: SwitchTenantButtonProps) {
  const { logout } = useLogout();
  const [isPending, setIsPending] = useState(false);

  async function handleSwitchTenant() {
    if (isPending) return;

    setIsPending(true);
    showImmediateAppLoader("جارٍ الرجوع لاختيار المنصة...");

    try {
      if (isElectronDesktop()) {
        const result = await window.electron!.desktopLogout();

        if (!result?.ok) {
          console.error("[desktop switch tenant] failed", result);
          removeImmediateAppLoader();
          setIsPending(false);
        }

        return;
      }

      if (logoutOnSwitch) {
        await logout();
      }

      await clearSelectedDesktopTenant();
      navigateToDesktopEntry();
    } catch (error) {
      console.error("[switch tenant] failed", error);
      removeImmediateAppLoader();
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      disabled={isPending}
      onClick={() => {
        void handleSwitchTenant();
      }}
      className={cn(className)}
    >
      {isPending ? "جارٍ التحميل..." : label}
    </Button>
  );
}