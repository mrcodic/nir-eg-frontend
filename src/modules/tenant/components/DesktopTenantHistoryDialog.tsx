import { useModal } from "@/context/ModalProvider";
import { DesktopTenantRecord } from "@/types/tenant.types";
import { Clock3, X } from "lucide-react";
import HistoryTenantCard from "./HistoryTenantCard";

export default function DesktopTenantHistoryDialog({
  tenants,
  onConnect,
  onDelete,
}: {
  tenants: DesktopTenantRecord[];
  onConnect: (tenant: DesktopTenantRecord) => void;
  onDelete: (tenant: DesktopTenantRecord) => void;
}) {
  const modal = useModal();

  return (
    <div className="rounded-xl bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
        <div className="flex items-center gap-2 text-slate-900">
          <Clock3 className="size-5" />
          <h2 className="text-32 font-bold">المنصات الأخيرة</h2>
        </div>

        <button
          type="button"
          onClick={modal.closeModal}
          className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          aria-label="إغلاق"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {tenants.map((tenant) => (
          <HistoryTenantCard
            key={`${tenant.slug}-${tenant.host}`}
            tenant={tenant}
            compact
            onConnect={() => onConnect(tenant)}
            onDelete={() => {
              onDelete(tenant);
              modal.closeModal();
            }}
          />
        ))}
      </div>
    </div>
  );
}
