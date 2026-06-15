"use client";

import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { isProd } from "@/utils/isProd";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <AuthLayout>
      <div className="form-layout wrapper flex items-center justify-center">
        <div className="card flex flex-col items-center justify-center space-y-10 bg-white/70">
          {!isProd && <p className="break-all">{error?.message}</p>}

          <div className="flex flex-col items-center justify-center space-y-6 text-center sm:px-4 dark:bg-gray-900">
            <h1 className="text-6xl font-bold text-red-800">500</h1>
            <h2 className="text-primary-800 mt-4 text-2xl font-semibold dark:text-gray-200">
              حدث خطأ غير متوقع
            </h2>
            <p className="mt-2 max-w-md dark:text-gray-400">
              نأسف! حدث خطأ ما. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة
              الرئيسية.
            </p>

            <div className="flex w-full flex-wrap gap-4">
              <Button
                onClick={() => router.push("/")}
                variant="outline-gray"
                className="mx-auto w-[150px] border-2 sm:w-[200px]"
              >
                العودة للرئيسية
              </Button>

              <Button
                onClick={() => reset()}
                className="mx-auto w-[150px] border-2 sm:w-[200px]"
              >
                حاول مرة أخرى
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
