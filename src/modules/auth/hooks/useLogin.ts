"use client";

import Cookies from "js-cookie";
import { z } from "zod";

import { useAuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/schemas";
import { presistUserPhone } from "@/lib/utils";
import { loginWithPhonePassword } from "@/services/auth.service";
import { saveCookie } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

type UseLoginParams = {
  onPhoneNotVerified: () => void;
};

export function useLogin({ onPhoneNotVerified }: UseLoginParams) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { setToken } = useAuthContext();

  const searchParams = useSearchParams();
  const redirectSearch = searchParams.get("redirect");
  const redirectPath = redirectSearch
    ? decodeURIComponent(redirectSearch)
    : null;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { phone, ...rest } = values;
      const response = await loginWithPhonePassword({
        phone: phone.phone,
        country: phone.country,
        country_iso: phone.country_iso || "EG",
        password: rest.password,
        recaptcha_token: rest.recaptcha_token,
      });

      await saveCookie(response?.access_token);

      Cookies.remove("guest_token");
      queryClient.invalidateQueries({ queryKey: ["/students/profile"] });

      setToken(response?.access_token);
      presistUserPhone(phone.phone, phone.country);

      if (response?.student?.type === 3 && response?.student?.has_center) {
        router.push(redirectPath || `bundles/${response?.student?.center_id}`);
        return;
      }

      if (response?.student?.type === 4 || response?.student?.type === 5) {
        router.push(
          redirectPath || `bundles?grade=${response?.student?.grade}`,
        );
        return;
      }

      if (
        response?.student?.type === 3 &&
        response?.student?.has_center === false
      ) {
        router.push(redirectPath || "profile");
      }
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        response?: {
          error?: { message?: string };
          data?: { message?: string };
        };
      };

      if (error?.status === 409) {
        localStorage.setItem("phone", values.phone.phone);
        toast({
          icon: "error",
          description: "رقم الهاتف غير مفعل",
        });
        onPhoneNotVerified();
        return;
      }

      toast({
        description:
          error?.status !== 500
            ? error?.response?.error?.message ||
              error?.response?.data?.message ||
              "حدث خطأ ما"
            : "حدث خطاء ما اثناء تسجيل الدخول",
        icon: "error",
      });
    }
  };

  return { onSubmit };
}
