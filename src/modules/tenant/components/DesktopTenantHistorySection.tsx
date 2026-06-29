"use client";

import StackedBanners, {
  StackedBannerItem,
} from "@/components/banners/StackedBanners";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useModal } from "@/context/ModalProvider";
import { useMounted } from "@/hooks/useMounted";
import { useDesktopTenantHistory } from "@/modules/tenant/hooks/useDesktopTenantHistory";
import { Clock3, Globe } from "lucide-react";
import { useMemo } from "react";
import DesktopTenantHistoryDialog from "./DesktopTenantHistoryDialog";
import HistoryTenantCard from "./HistoryTenantCard";

export default function DesktopTenantHistorySection() {
  const modal = useModal();
  const isMounted = useMounted();

  const {
    recentTenants,
    connectRecentTenant,
    deleteRecentTenant,
    historyPhone,
    hasStoredPhone,
    isLoadingHistory,
  } = useDesktopTenantHistory();

  const previewTenants = recentTenants.slice(0, 3);

  const stackedItems = useMemo<StackedBannerItem[]>(() => {
    return previewTenants.map((tenant) => ({
      id: `${tenant.slug}-${tenant.host}`,
      className: "p-0 rounded-none bg-transparent border-none shadow-none ",
      wrapperClassName: "w-full pe-0",
      content: (
        <HistoryTenantCard
          tenant={tenant}
          onConnect={() => connectRecentTenant(tenant)}
          onDelete={() => deleteRecentTenant(tenant)}
          className="shadow-sm"
        />
      ),
    }));
  }, [connectRecentTenant, deleteRecentTenant, previewTenants]);

  const openHistoryDialog = () => {
    modal.setDialogContent(
      <DesktopTenantHistoryDialog
        tenants={recentTenants}
        onConnect={connectRecentTenant}
        onDelete={deleteRecentTenant}
      />,
    );
    modal.setDialogContentProps({
      className:
        "w-[min(980px,calc(100vw-32px))] max-w-[980px] rounded-[32px] border-0 p-0 shadow-2xl",
      hideClose: true,
    });
    modal.openModal();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-700">
          <Clock3 className="size-4" />
          <h2 className="text-base font-bold">المنصات الأخيرة</h2>
        </div>

        <p className="text-sm text-slate-400">
          {isMounted && hasStoredPhone
            ? `مرتبطة بآخر رقم محفوظ على التطبيق: ${historyPhone}`
            : "سيظهر سجل المنصات هنا بمجرد أن تسجل الدخول للمرة الأولى"}
        </p>
      </div>

      {!isMounted || isLoadingHistory ? (
        <Card className="border-gray-light/80 rounded-[28px] bg-white">
          <CardContent className="py-8 text-center text-sm font-bold text-slate-500">
            جارٍ تحميل سجل المنصات...
          </CardContent>
        </Card>
      ) : !hasStoredPhone ? (
        <Card className="border-dashed border-slate-300 bg-slate-50/70">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Globe className="text-primary-800/70 size-8" />
            <p className="text-base font-bold text-slate-700">
              لا يوجد رقم هاتف محفوظ بعد
            </p>
            <p className="max-w-md text-sm leading-7 text-slate-500">
              سيتم عرض المنصات الخاصة بك هنا بعد التسجيل لاول مره
            </p>
          </CardContent>
        </Card>
      ) : stackedItems.length > 0 ? (
        <div className="space-y-8">
          <StackedBanners
            banners={stackedItems}
            showDismissButton={false}
            animateY={(index) => (index > 0 ? 17 : 0)}
            animateScale={() => 1}
          />

          {recentTenants.length > 1 && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline-primary"
                className="h-12 w-full max-w-[155px] rounded-xl text-sm font-bold"
                onClick={openHistoryDialog}
              >
                عرض المزيد
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed border-slate-300 bg-slate-50/70">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Globe className="text-primary-800/70 size-8" />
            <p className="text-base font-bold text-slate-700">
              لا توجد منصات محفوظة لهذا الرقم
            </p>
            <p className="max-w-md text-sm leading-7 text-slate-500">
              سيتم عرض المنصات الخاصة بك هنا بعد التسجيل لاول مره
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
