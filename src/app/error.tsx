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
  return (
    <AuthLayout img={"/assets/error.png"}>
      <div className="form-layout flex items-center justify-center">
        <div className=" card p-6 bg-white/70 flex items-center justify-center flex-col space-y-10 ">
          {/* {JSON.stringify(error)} */}
          <p>{error?.message}</p>

          <div className="flex space-y-6 flex-col justify-center items-center  dark:bg-gray-900 text-center px-4">
            <h1 className="text-6xl font-bold text-red-800">500</h1>
            <h2 className="text-2xl font-semibold mt-4 dark:text-gray-200 text-primary-700">
              حدث خطأ غير متوقع
            </h2>
            <p className="mt-2 dark:text-gray-400 max-w-md">
              نأسف! حدث خطأ ما. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة
              الرئيسية.
            </p>

            <div className="flex gap-4 w-full flex-wrap">
              <Button
                onClick={() => router.push("/")}
                className="text-gray-25 border-2 bg-white hover:bg-gray-100 w-[200px] mx-auto"
              >
                العودة للرئيسية
              </Button>

              <Button
                onClick={() => reset()}
                className="text-gray-25 border-2 bg-[#523412] text-white  w-[200px] "
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
