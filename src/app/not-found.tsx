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
        <div className="card flex flex-col items-center justify-center space-y-10 bg-white/70 p-6">
          <div className="flex flex-col items-center justify-center space-y-6 px-4 text-center dark:bg-gray-900">
            <h1 className="text-primary-700 mt-4 text-2xl font-semibold dark:text-gray-200">
              الصفحة غير موجودة
            </h1>
            <p className="mt-2 max-w-md dark:text-gray-400">
              الصفحة التي تبحث عنها غير موجودة.
            </p>

            <div className="flex w-full flex-wrap gap-4">
              <Button
                onClick={() => router.push("/")}
                className="text-gray-25 bg-primary mx-auto w-[200px] border-2 text-white hover:bg-white hover:text-black"
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
