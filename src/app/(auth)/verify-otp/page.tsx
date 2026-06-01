"use client";

import AuthHeader from "@/layouts/AuthHeader";
import OtpVerifyForm from "@/modules/auth/components/OtpVerifyForm";
import { getLocalStorage } from "@/utils/clientFun";
import { setResetPasswordOtpGate } from "@/utils/reset-password-gate";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "forget" | "login";

  const [phone, setPhone] = useState(() => getLocalStorage("phone") ?? "");

  useEffect(() => {
    if (phone) return;
    const stored = getLocalStorage("phone");

    if (stored) {
      setPhone(stored);
    } else {
      router.push(type === "forget" ? "/forgetPassword" : "/login");
    }
  }, [phone, router, type]);

  return (
    <div>
      <AuthHeader
        title="تأكيد رقم الهاتف"
        description={
          <span>
            سنقوم بإرسال رمز التأكيد إلى رقم الهاتف التالي{" "}
            <span
              dir="ltr"
              className="text-primary-800 font-bold underline"
              suppressHydrationWarning
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

        {type === "forget" ? (
          <div className="mt-6 flex items-center gap-2">
            <span className="text-gray-dark font-medium">ليس لديك حساب؟</span>
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
      </div>
    </div>
  );
}
