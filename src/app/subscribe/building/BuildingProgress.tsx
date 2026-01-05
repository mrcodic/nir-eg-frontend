"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPublicData } from "@/config/client-fetch";
import { StepName, TenantProgress } from "@/types/building.types";
import Lottie from "lottie-react";
import { useEffect, useMemo, useState } from "react";
import buildingAnimation from "../../../../public/assets/animations/waiting.json";

const POLL_INTERVAL = 3000;

const mapStepNameToArabic: Record<StepName, string> = {
  create_db: "إنشاء قاعدة البيانات",
  migrate: "تثبيت البيانات",
  owner: "إنشاء حساب المسؤول",
  finalize: "إتمام الإنشاء",
};

export default function BuildProgress({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState<TenantProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let timer: NodeJS.Timeout;

    const fetchProgress = async () => {
      try {
        const data = await getPublicData<TenantProgress>({
          queryKey: [`/tenants/${tenantId}/progress`],
        });

        if (data?.percent === 100) {
          // window.open(data?.domains?.public, "_blank");
          // window.open(data?.domains?.admin + "/login", "_blank");

          clearInterval(timer);
        }

        setData(data);
      } catch {
        setError("حدث خطأ أثناء متابعة حالة الإنشاء");
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
          <div className="sm:size-[428px] max-w-[428px] max-sm:w-full aspect-square">
            <Lottie animationData={buildingAnimation} loop />
          </div>

          {/* Title */}
          <h1 className="mt-6 font-bold text-xl sm:text-32 text-gradient-custom">
            نحن الآن نعمل على إنشاء موقعك…
          </h1>

          <p className="mt-2 text-base sm:text-xl font-bold">
            لا تغلق الصفحة، سيتم تحويلك تلقائيًا عند الانتهاء
          </p>

          {/* Current step */}
          {currentStep && (
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

          {error && <p className="mt-4 text-red-500 font-bold">{error}</p>}

          {data?.percent === 100 && (
            <div className="mt-6 flex gap-4">
              <a
                href={data?.domains?.public}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant={"animated-gradient"}>زيارة الموقع</Button>
              </a>

              <a
                href={`${data?.domains?.admin}/login`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant={"animated-gradient"}>لوحة التحكم</Button>
              </a>
            </div>
          )}
          {/* Progress bar */}
          <div className="w-full mt-4 space-y-3">
            <Progress value={data?.percent ?? 0} />
            <p className="font-semibold sm:text-base text-sm">
              {data?.percent ?? 0}% مكتمل
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
