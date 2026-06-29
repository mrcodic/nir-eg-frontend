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

    try {
      if (logoutOnSwitch) {
        await logout();
      }

      await clearSelectedDesktopTenant();
      navigateToDesktopEntry();
    } finally {
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
      {label}
    </Button>
  );
}
