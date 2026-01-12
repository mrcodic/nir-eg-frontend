"use client";

import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const isProd = process.env.NODE_ENV === "production";

  return (
    <AuthLayout img={"/assets/error.png"}>
      <div className="form-layout flex items-center justify-center">
        <div className="card flex flex-col items-center justify-center space-y-10 bg-white/70 p-6">
          {!isProd && <p>{error?.message}</p>}

          <div className="flex flex-col items-center justify-center space-y-6 px-4 text-center dark:bg-gray-900">
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
                className="text-gray-25 mx-auto w-[200px] border-2 bg-white hover:bg-gray-100"
              >
                العودة للرئيسية
              </Button>

              <Button
                onClick={() => reset()}
                className="text-gray-25 w-[200px] border-2 bg-[#523412] text-white"
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
