import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatApiDate } from "@/helpers/format-api-date";
import { cn } from "@/lib/utils";
import { DesktopTenantRecord } from "@/types/tenant.types";
import { Building2, CalendarDays, Code2, LogIn, Trash2 } from "lucide-react";

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
    <Card className="border-gray-light/80 rounded-xl bg-white shadow-md">
      <CardContent
        dir="rtl"
        className={cn("grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_200px]")}
      >
        <div className="flex items-center gap-4">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-4">
            <Building2 className="text-primary-800 size-8" />
          </div>

          <div className="min-w-0 flex-1 space-y-2 text-right">
            <p
              className={cn(
                "truncate text-2xl font-bold text-slate-900",
                compact && "text-xl",
              )}
            >
              {tenant.brand_name || tenant.name}
            </p>

            <div className="w-fit space-y-1.5 text-sm text-slate-500">
              <div className="flex items-center justify-end gap-2">
                <CalendarDays className="text-primary-800 size-4" />
                <span>{formatApiDate(tenant.last_used_at)}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Code2 className="text-primary-800 size-4" />
                <span className="truncate">{tenant.host}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onDelete}
            className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100"
            aria-label="إخفاء من القائمة"
          >
            <Trash2 className="size-5" />
          </button>

          <Button
            type="button"
            className={cn(
              "h-8 w-full rounded-xl text-xs font-bold md:max-w-[200px]",
            )}
            onClick={onConnect}
          >
            <LogIn className="size-4" />
            اتصال
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
