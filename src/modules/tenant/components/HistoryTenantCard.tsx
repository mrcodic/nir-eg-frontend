import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DesktopTenantRecord } from "@/types/tenant.types";
import { Building2, CalendarDays, Code2, LogIn, Trash2 } from "lucide-react";
import Image from "next/image";

function formatTenantDate(value: string) {
  return new Date(value).toLocaleDateString("ar-EG");
}

export default function HistoryTenantCard({
  tenant,
  onConnect,
  onDelete,
  compact = false,
}: {
  tenant: DesktopTenantRecord;
  onConnect: () => void;
  onDelete: () => void;
  compact?: boolean;
}) {
  return (
    <Card className="border-gray-light/80 rounded-[28px] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <CardContent
        className={cn(
          "grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_200px]",
          compact && "gap-3 p-4 md:grid-cols-[minmax(0,1fr)_180px]",
        )}
      >
        <div className="order-2 flex flex-col gap-3 md:order-1 md:items-start">
          <Button
            type="button"
            className={cn(
              "h-12 w-full rounded-xl text-lg font-bold md:max-w-[200px]",
              compact && "h-10 text-base md:max-w-[170px]",
            )}
            onClick={onConnect}
          >
            <LogIn className="size-4" />
            اتصال
          </Button>

          <button
            type="button"
            onClick={onDelete}
            className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100"
            aria-label="إخفاء من القائمة"
          >
            <Trash2 className="size-5" />
          </button>
        </div>

        <div className="order-1 flex items-center justify-between gap-4 md:order-2">
          <div className="min-w-0 flex-1 space-y-2 text-right">
            <p
              className={cn(
                "truncate text-2xl font-bold text-slate-900",
                compact && "text-xl",
              )}
            >
              {tenant.brand_name || tenant.name}
            </p>

            <div className="space-y-1.5 text-sm text-slate-500">
              <div className="flex items-center justify-end gap-2">
                <CalendarDays className="text-primary-800 size-4" />
                <span>{formatTenantDate(tenant.last_used_at)}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Code2 className="text-primary-800 size-4" />
                <span className="truncate">{tenant.host}</span>
              </div>
            </div>
          </div>

          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-4">
            {tenant.logo ? (
              <Image
                src={tenant.logo}
                alt={tenant.name}
                width={96}
                height={96}
                className="size-full object-contain"
              />
            ) : (
              <Building2 className="text-primary-800 size-8" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
