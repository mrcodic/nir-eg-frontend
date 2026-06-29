"use client";

import Cookies from "js-cookie";
import { OctagonX, X } from "lucide-react";
import { useMemo, useState } from "react";

import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/CustomImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { extractTenantFromHost } from "@/helpers/fetchers/fetch-utils";
import {
  buildTargetOrigin,
  getSwitchTenantErrorMessage,
  normalizeDomain,
} from "@/helpers/tenant.helpers";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UserTenant } from "@/types/tenant.types";
import Image from "next/image";
import useSwitchTenant from "../hooks/useSwitchTenant";
import useTenants from "../hooks/useTenants";

export default function UserTenantSwitch() {
  const { toast } = useToast();
  const { tenants, isLoading, error } = useTenants();
  const { mutateAsync: switchTenant, isPending } = useSwitchTenant();
  const [isSwitching, setIsSwitching] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState("");

  const sortedTenants = useMemo(() => {
    const { subdomain } = extractTenantFromHost();

    return [...tenants].sort((a, b) => {
      if (a.slug === subdomain) return -1;
      if (b.slug === subdomain) return 1;
      return 0;
    });
  }, [tenants]);

  async function handleSwitchTenant(tenantId: string) {
    try {
      const response = await switchTenant(tenantId);

      const targetTenant = tenants.find(
        (tenant) => tenant.tenant_id === tenantId,
      );
      const token = Cookies.get("nir_token");

      if (!targetTenant || !token) {
        toast({ icon: "error", description: "حدث خطأ أثناء التحويل" });
        return;
      }

      const normalizedTarget: UserTenant = {
        ...targetTenant,
        slug: response?.active_tenant?.slug || targetTenant.slug,
        domain_type:
          response?.active_tenant?.domain_type || targetTenant.domain_type,
      };

      const targetOrigin = buildTargetOrigin(normalizedTarget);
      const switchUrl = `${targetOrigin}/api/auth/switch?token=${encodeURIComponent(token)}`;

      setIsSwitching(true);

      window.open(switchUrl, "_self", "noopener,noreferrer");

      toast({ icon: "loading", description: "جاري التحويل..." });
    } catch (switchError) {
      toast({
        icon: "error",
        description: getSwitchTenantErrorMessage(switchError),
      });
    }
  }

  if (tenants.length <= 1) return null;

  return (
    <DropdownMenu dir="rtl" modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="border-primary-100 group hover:bg-primary-800 relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all focus:outline-hidden disabled:pointer-events-auto disabled:hover:bg-transparent">
        <div
          className={cn(
            "bg-primary-800 group-disabled:bg-primary me-px h-6 w-5 mask-center mask-no-repeat transition-all group-hover:bg-white",
          )}
          style={{
            maskImage: "url(/assets/icons/up-down.svg)",
            maskSize: "contain",
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="border-gray-light w-[min(368px,calc(100vw-24px))] rounded-lg border bg-white p-0 shadow-md">
        <div className="border-gray-light flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-xs font-medium text-black">اختر مدرس</h3>
          <button
            type="button"
            className="bg-gray-light text-gray-dark flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
            aria-label="close"
            onClick={() => setOpen(false)}
          >
            <X className="size-3" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2 px-4 py-2">
            <Skeleton className="h-11 w-full" />
            <div className="border-gray-light border-b" />
            <Skeleton className="h-11 w-full" />
            <div className="border-gray-light border-b" />
            <Skeleton className="h-11 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <OctagonX className="text-destructive size-10" />
            <p className="text-sm font-medium text-black">حدث خطأ</p>
          </div>
        ) : (
          <ScrollArea
            dir="rtl"
            className="w-full py-2 **:data-radix-scroll-area-viewport:max-h-[min(281px,calc(100dvh-220px))]"
          >
            <div className="px-4">
              <div className="space-y-2">
                {sortedTenants.map((tenant, idx) => {
                  const { subdomain, host } = extractTenantFromHost();
                  const cleanHost = host.replace(/:\d+$/, "");
                  const tenantDomain = normalizeDomain(tenant.domain);
                  const selected = selectedTenantId === tenant.tenant_id;
                  const isCurrentTenant =
                    tenant.domain_type === "subdomain"
                      ? subdomain === tenant.slug
                      : cleanHost === tenantDomain;

                  return (
                    <div key={tenant.tenant_id} className="space-y-2">
                      <DropdownMenuItem
                        onClick={() => {
                          if (isPending || isSwitching) return;
                          setSelectedTenantId(tenant.tenant_id);
                        }}
                        onSelect={(e) => e.preventDefault()}
                        disabled={isCurrentTenant || isPending || isSwitching}
                        className={cn(
                          "hover:bg-primary-50 focus:bg-primary-50 flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-1.5 text-right transition-colors",
                          selected && "bg-primary-50",
                          isCurrentTenant &&
                            "border border-green-500 bg-green-50 data-disabled:opacity-100",
                        )}
                      >
                        <CustomImage
                          src={tenant.logo}
                          alt={tenant.name}
                          fallback="/logo.svg"
                          width={30}
                          height={31}
                          className="me-auto size-8 rounded-lg object-contain"
                        />

                        {isCurrentTenant && (
                          <Image
                            src={"/assets/success.svg"}
                            alt={" current tenant "}
                            width={16}
                            height={16}
                            className="size-4"
                          />
                        )}
                        <p className="text-sm font-normal text-black">
                          {tenant.name}
                        </p>
                      </DropdownMenuItem>

                      {idx !== sortedTenants.length - 1 && (
                        <div className="border-gray-light border-b" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        )}

        {tenants.length > 0 && (
          <div className="mt-2 px-4 pb-2">
            <Button
              disabled={
                isLoading || !selectedTenantId || isPending || isSwitching
              }
              onClick={() => {
                void handleSwitchTenant(selectedTenantId);
              }}
              className="h-8 w-full max-w-full rounded-lg px-2 text-sm font-bold"
            >
              {(isPending || isSwitching) && (
                <SmallSpinner className="size-4 text-white" />
              )}
              تأكيد
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
