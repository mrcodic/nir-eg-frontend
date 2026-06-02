"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuthContext } from "@/context/auth-context";
import { useMounted } from "@/hooks/useMounted";
import AuthHeader from "@/layouts/AuthHeader";
import { getUserPhoneFromStorage } from "@/lib/utils";
import OtpVerifyForm from "@/modules/auth/components/OtpVerifyForm";
import { setResetPasswordOtpGate } from "@/utils/reset-password-gate";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMounted = useMounted();

  const { profile } = useAuthContext();

  const type = searchParams.get("type") as "forget" | "login";
  const phone = isMounted ? getUserPhoneFromStorage().phone : "";

  useEffect(() => {
    if (!isMounted || phone) return;
    router.push(type === "forget" ? "/forgetPassword" : "/login");
  }, [isMounted, phone, router, type]);

  if (!isMounted) {
    return <LoadingSpinner className="h-full min-h-[300px]" />;
  }

  return (
    <div>
      <AuthHeader
        title="تأكيد رقم الهاتف"
        description={
          <span>
            سنقوم بإرسال رمز التأكيد إلى رقم الهاتف التالي{" "}
            <span
              dir="ltr"
              className="text-primary-800 pe-1 font-bold underline"
            >
              {phone}
            </span>
          </span>
        }
      />

      <div className="mt-10 w-full">
        <OtpVerifyForm
          phone={phone}
          onSuccess={async () => {
            if (type === "forget") {
              setResetPasswordOtpGate(phone);
              router.push("/resetPassword");
              return;
            }
            router.push("/login");
          }}
        />

        {!profile && isMounted && (
          <>
            {type === "forget" ? (
              <div className="mt-6 flex items-center gap-2">
                <span className="text-gray-dark font-medium">
                  ليس لديك حساب؟
                </span>
                <Link
                  href="/register"
                  className="text-primary-800 border-gray-light rounded-md border px-4 text-sm font-bold underline"
                >
                  إنشاء حساب
                </Link>
              </div>
            ) : (
              <div className="mt-14 flex gap-2">
                <span className="text-gray-dark font-medium">
                  لديك حساب بالفعل؟
                </span>
                <Link
                  href="/login"
                  className="text-primary-800 border-gray-light rounded-md border px-4 text-sm font-bold underline"
                >
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
