"use client";

import { QueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { z } from "zod";

import { openDesktopAuthDeeplink } from "@/helpers/auth-deeplink";
import { loginSchema } from "@/lib/schemas";
import { presistUserPhone } from "@/lib/utils";
import { loginWithPhonePassword } from "@/services/auth.service";
import { saveCookie } from "@/utils/api";

type UseLoginParams = {
  router: AppRouterInstance;
  queryClient: QueryClient;
  redirectPath: string | null;
  setToken: (token: string) => void;
  onPhoneNotVerified: (phone: string) => void;
  onErrorToast: (message: string) => void;
};

export function useLogin({
  router,
  queryClient,
  redirectPath,
  setToken,
  onPhoneNotVerified,
  onErrorToast,
}: UseLoginParams) {
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
      openDesktopAuthDeeplink(response);

      if (response?.student?.type === 3 && response?.student?.has_center) {
        router.push(redirectPath || `bundles/${response?.student?.center_id}`);
        return;
      }

      if (response?.student?.type === 4 || response?.student?.type === 5) {
        router.push(redirectPath || `bundles?grade=${response?.student?.grade}`);
        return;
      }

      if (response?.student?.type === 3 && response?.student?.has_center === false) {
        router.push(redirectPath || "profile");
      }
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        response?: { error?: { message?: string }; data?: { message?: string } };
      };

      if (error?.status === 409) {
        onPhoneNotVerified(values.phone.phone);
        return;
      }

      onErrorToast(
        error?.status !== 500
          ? error?.response?.error?.message || error?.response?.data?.message || "حدث خطأ ما"
          : "حدث خطاء ما اثناء تسجيل الدخول",
      );
    }
  };

  return { onSubmit };
}
