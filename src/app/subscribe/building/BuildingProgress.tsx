"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPublicData } from "@/config/client-fetch";
import { StepName, TenantProgress } from "@/types/building.types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BuildingAnimation from "./BuildingAnimation";

const POLL_INTERVAL = 4000;

const mapStepNameToArabic: Record<StepName, string> = {
  create_db: "إنشاء قاعدة البيانات",
  migrate: "تثبيت البيانات",
  owner: "إنشاء حساب المسؤول",
  finalize: "إتمام الإنشاء",
};

export default function BuildProgress({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState<TenantProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let timer: NodeJS.Timeout;

    const fetchProgress = async () => {
      try {
        const data = await getPublicData<TenantProgress>({
          queryKey: [`/tenants/${tenantId}/progress`],
        });

        setData(data);

        if (data?.percent === 100) {
          clearInterval(timer);
        }
      } catch {
        setError("حدث خطأ أثناء متابعة حالة الإنشاء");
        clearInterval(timer);
      } finally {
        // ✅ stop loading ONLY after first response
        setIsInitialLoading(false);
      }
    };

    fetchProgress();
    timer = setInterval(fetchProgress, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, [tenantId]);

  const stepsArray = useMemo(() => {
    return data?.steps
      ? (Object.entries(data.steps) as [
          StepName,
          TenantProgress["steps"][StepName]
        ][])
      : [];
  }, [data]);

  const isCompleted = data?.percent === 100;

  const currentStep = useMemo(() => {
    if (!stepsArray.length) return null;

    const running = stepsArray.find(
      ([, step]) => step.status !== "done" && !step.skipped
    );
    if (running) return running;

    const doneSteps = stepsArray.filter(([, step]) => step.status === "done");
    return doneSteps.at(-1) ?? null;
  }, [stepsArray]);

  return (
    <div className="flex items-center justify-center mb-20 mt-10">
      <main className="wrapper">
        <div className="flex flex-col items-center text-center">
          {/* Animation */}
          <BuildingAnimation isCompleted={isCompleted} isError={!!error} />

          {/* Title */}
          <h1 className="mt-6 font-bold text-xl sm:text-32 text-gradient-custom">
            {isCompleted
              ? "تم انشاء موقعك بنجاح"
              : error
              ? "حدث خطاء اثناء متابعة حالة الانشاء"
              : "نحن الآن نعمل على إنشاء موقعك…"}
          </h1>

          {!error && (
            <p className="mt-2 text-base sm:text-xl font-bold">
              {isCompleted
                ? "يمكنك الان زيارة موقعك او لوحة التحكم الخاصة بك"
                : "نحن الآن نعمل على إنشاء موقعك…"}
            </p>
          )}

          {/* Current step */}
          {!isCompleted && currentStep && (
            <div className="mt-6 text-sm sm:text-base font-bold text-gray-dark flex gap-2 items-center">
              <span>{mapStepNameToArabic[currentStep[0]]}</span>
              <span>
                {currentStep[1].status === "done"
                  ? "✅ تم"
                  : currentStep[1].skipped
                  ? "⏭ تم التخطي"
                  : "⏳ جارٍ التنفيذ"}
              </span>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <p className="mt-4 text-red-500 font-extrabold text-lg">
                {error}
              </p>
              {/* "+201500048141" */}
              <Link href="https://wa.me/201500048141">
                <Button
                  className="w-full rounded-lg px-4 py-3 text-lg h-11"
                  variant="animated-gradient"
                >
                  تواصل مع فريق الدعم
                </Button>
              </Link>
            </div>
          )}

          {/* First-load loading progress */}
          {isInitialLoading && !data && (
            <div className="w-full mt-8 flex justify-center items-center gap-1">
              <Loader2 className="animate-spin size-4 text-black" />
              <p className="font-semibold sm:text-base text-sm animate-pulse">
                جاري بدء عملية الإنشاء…
              </p>
            </div>
          )}

          {/* Actions after completion */}
          {!error && data?.percent === 100 && (
            <div className="mt-8 flex gap-4">
              <a
                href={data?.domains?.public}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="font-bold" variant="animated-gradient">
                  زيارة الموقع
                </Button>
              </a>

              <a
                href={`${data?.domains?.admin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="font-bold" variant="animated-gradient">
                  لوحة التحكم
                </Button>
              </a>
            </div>
          )}

          {!error && !isInitialLoading && (
            <div className="w-full mt-4 space-y-3">
              <Progress value={data?.percent ?? 0} />
              <p className="font-semibold sm:text-base text-sm">
                {data?.percent ?? 0}% مكتمل
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
