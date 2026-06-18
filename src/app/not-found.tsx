"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import AuthLayout from "@/layouts/AuthLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { profile } = useAuthContext();
  const router = useRouter();

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center px-4 text-center dark:bg-gray-900">
        <div className="relative aspect-square w-full max-w-60">
          <Image
            src="/assets/bg/empty-2.png"
            alt="empty image"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-primary-700 mt-4 text-2xl font-semibold dark:text-gray-200">
          الصفحة غير موجودة
        </h1>

        <p className="mt-2 max-w-md dark:text-gray-400">
          الصفحة التي تبحث عنها غير موجودة.
        </p>

        <div className="mt-4 flex w-full flex-wrap gap-4">
          <Button
            onClick={() => router.push(!!profile ? "/bundles" : "/")}
            className="mx-auto w-full max-w-[200px]"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
