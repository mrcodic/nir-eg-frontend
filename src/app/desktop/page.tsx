"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DesktopTenantHistorySection from "@/modules/tenant/components/DesktopTenantHistorySection";
import { useDesktopTenantEntry } from "@/modules/tenant/hooks/useDesktopTenantEntry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Code2, GlobeIcon, Link } from "lucide-react";
import Image from "next/image";

export default function DesktopPage() {
  const {
    mode,
    setMode,
    platformCode,
    setPlatformCode,
    platformUrl,
    setPlatformUrl,
    submit,
    isPending,
  } = useDesktopTenantEntry();

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="space-y-8">
        <div className="border-gray-light border-b pb-2">
          <Image
            src="/logo.svg"
            width={66}
            height={48}
            alt="logo"
            className="h-12 w-[66px]"
          />
          <h2 className="mt-8 text-2xl font-bold text-slate-900">
            أهلا بيك فى نير
          </h2>
          <p className="mt-1 text-base font-bold text-gray-600">
            علشان تبدأ , انضم لمنصة مدرستك.
          </p>
        </div>

        <div className="space-y-6">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "code" | "url")}
            className="w-full"
          >
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2">
              <TabsTrigger
                value="code"
                className="border-primary-800 text-primary data-[state=active]:bg-primary-800 h-12 rounded-lg border py-3 text-sm font-bold data-[state=active]:text-white"
              >
                كود المنصة
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="border-primary-800 text-primary data-[state=active]:bg-primary-800 h-12 rounded-lg border py-3 text-sm font-bold data-[state=active]:text-white"
              >
                رابط الموقع
              </TabsTrigger>
            </TabsList>

            <TabsContent dir="rtl" value="code" className="mt-6 space-y-3">
              <label className="flex flex-wrap items-center gap-1 text-right text-sm font-bold text-slate-700">
                <Code2 className="size-4" /> كود المنصة
              </label>

              <div className="relative">
                <Code2 className="text-primary absolute top-1/2 right-4 size-4 -translate-y-1/2" />
                <Input
                  value={platformCode}
                  onChange={(event) => setPlatformCode(event.target.value)}
                  placeholder="مثال: 21321"
                  className="h-12 rounded-xl ps-10 text-right"
                />
              </div>

              <p className="text-right text-sm text-slate-500">
                استخدم الكود كما اخذته من المنصة.
              </p>

              <button className="text-secondary mx-auto mt-12 flex cursor-pointer items-center gap-1 text-right text-sm font-bold hover:underline">
                <Link className="size-4" /> كيفية الوصول للكود
              </button>
            </TabsContent>

            <TabsContent dir="rtl" value="url" className="mt-6 space-y-3">
              <label className="flex flex-wrap items-center gap-1 text-right text-sm font-bold text-slate-700">
                <GlobeIcon className="size-4" /> رابط المنصة
              </label>
              <div className="relative">
                <GlobeIcon className="text-primary absolute top-1/2 right-4 size-4 -translate-y-1/2" />
                <Input
                  value={platformUrl}
                  onChange={(event) => setPlatformUrl(event.target.value)}
                  placeholder="مثال teacher.nir-edu.com أو school.com"
                  className="h-12 rounded-xl ps-10 text-right"
                />
              </div>
              <p className="text-right text-sm text-slate-500">
                يمكنك إدخال رابط المنصة الخاص بمدرستك
              </p>
            </TabsContent>
          </Tabs>

          <Button
            type="button"
            className="h-12 w-full text-base font-bold"
            onClick={submit}
            disabled={isPending}
          >
            {isPending ? "جارٍ التحقق من المنصة..." : "تسجيل دخول"}
          </Button>
        </div>
      </div>

      <DesktopTenantHistorySection />
    </section>
  );
}
