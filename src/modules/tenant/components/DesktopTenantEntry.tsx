"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthHeader from "@/layouts/AuthHeader";
import { cn } from "@/lib/utils";
import { useDesktopTenantEntry } from "@/modules/tenant/hooks/useDesktopTenantEntry";
import { Building2, Clock3, Globe, LogIn, Trash2 } from "lucide-react";
import Image from "next/image";

function RecentTenantCard({
  tenant,
  onConnect,
  onDelete,
}: {
  tenant: {
    slug: string;
    host: string;
    name: string;
    brand_name: string | null;
    logo: string;
    last_used_at: string;
  };
  onConnect: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="border-gray-light/70 bg-white shadow-sm">
      <CardContent className="flex flex-wrap items-center gap-4 p-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white">
          {tenant.logo ? (
            <Image
              src={tenant.logo}
              alt={tenant.name}
              width={64}
              height={64}
              className="size-full object-contain p-2"
            />
          ) : (
            <Building2 className="text-primary-800 size-6" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-base font-bold text-slate-900">
            {tenant.brand_name || tenant.name}
          </p>
          <p className="truncate text-sm text-slate-500">{tenant.host}</p>
          <p className="text-xs text-slate-400">
            آخر استخدام:{" "}
            {new Date(tenant.last_used_at).toLocaleDateString("ar-EG")}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <Button
            type="button"
            size="sm"
            className="min-w-24"
            onClick={onConnect}
          >
            <LogIn className="ms-1 size-4" />
            اتصال
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="min-w-24"
            onClick={onDelete}
          >
            <Trash2 className="ms-1 size-4" />
            حذف
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DesktopTenantEntry() {
  const {
    mode,
    setMode,
    platformCode,
    setPlatformCode,
    platformUrl,
    setPlatformUrl,
    recentTenants,
    connectRecentTenant,
    deleteRecentTenant,
    lastPhone,
    submit,
    isPending,
  } = useDesktopTenantEntry();

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-6 lg:py-16">
      <div className="space-y-8">
        <AuthHeader
          title="تسجيل الدخول"
          description=" أدخل رقم الهاتف المسجل لدينا و كلمة السر لتتمكن من الدخول لحسابك"
        />

        <div className="space-y-6">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "code" | "url")}
            className="w-full"
          >
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-primary-800 rounded-xl py-3 text-sm font-bold data-[state=active]:text-white"
              >
                كود المنصة
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="data-[state=active]:bg-primary-800 rounded-xl py-3 text-sm font-bold data-[state=active]:text-white"
              >
                رابط الموقع
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="mt-6 space-y-3">
              <label className="block text-right text-sm font-bold text-slate-700">
                كود المنصة
              </label>
              <Input
                value={platformCode}
                onChange={(event) => setPlatformCode(event.target.value)}
                placeholder="مثال: 21321"
                className="h-12 rounded-xl text-right"
              />
              <p className="text-right text-sm text-slate-500">
                استخدم الكود كما استلمته من مدير المنصة.
              </p>
            </TabsContent>

            <TabsContent value="url" className="mt-6 space-y-3">
              <label className="block text-right text-sm font-bold text-slate-700">
                رابط المنصة
              </label>
              <Input
                value={platformUrl}
                onChange={(event) => setPlatformUrl(event.target.value)}
                placeholder="teacher.nir-edu.com أو school.com : مثال"
                className="h-12 rounded-xl placeholder:text-right"
              />
              <p className="text-right text-sm text-slate-500">
                يمكنك إدخال رابط subdomain أو custom domain وسنحدد نوعه
                تلقائيًا.
              </p>
            </TabsContent>
          </Tabs>

          <Button
            type="button"
            className="h-12 w-full rounded-xl text-base font-bold"
            onClick={submit}
            disabled={isPending}
          >
            {isPending ? "جارٍ التحقق من المنصة..." : "تسجيل دخول"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock3 className="size-4" />
            <h2 className="text-base font-bold">المنصات الأخيرة</h2>
          </div>
          <p
            className={cn("text-sm text-slate-400", !lastPhone && "opacity-70")}
          >
            {lastPhone
              ? `مرتبطة بآخر رقم استخدمته: ${lastPhone}`
              : "سيظهر هنا آخر المنصات التي استخدمتها على هذا الجهاز"}
          </p>
        </div>

        {recentTenants.length > 0 ? (
          <div className="space-y-3">
            {recentTenants.map((tenant) => (
              <RecentTenantCard
                key={`${tenant.slug}-${tenant.host}`}
                tenant={tenant}
                onConnect={() => connectRecentTenant(tenant)}
                onDelete={() => deleteRecentTenant(tenant)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-slate-300 bg-slate-50/70">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <Globe className="text-primary-800/70 size-8" />
              <p className="text-base font-bold text-slate-700">
                لا توجد منصات محفوظة بعد
              </p>
              <p className="max-w-md text-sm leading-7 text-slate-500">
                بعد الدخول إلى أي منصة من هذه الشاشة سنعرضها هنا لتتمكن من
                العودة إليها بسرعة في المرات القادمة.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
