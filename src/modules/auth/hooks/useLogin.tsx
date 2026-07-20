"use client";

import { OTPNotVerifIed } from "@/components/modals/OTPNotVerifIed";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/schemas/auth.schema";
import { presistUserPhone } from "@/lib/utils";
import { loginWithPhonePassword } from "@/services/auth.service";
import { saveCookie } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export function useLogin() {
  const { toast } = useToast();
  const modal = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const { setToken } = useAuthContext();

  const searchParams = useSearchParams();
  const redirectSearch = searchParams.get("redirect");
  const redirectPath = redirectSearch
    ? decodeURIComponent(redirectSearch)
    : null;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
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

      // console.log("login user : ", response?.student);

      queryClient.setQueryData(["/students/profile"], response.student);

      setToken(response?.access_token);
      presistUserPhone(phone.phone, phone.country);

      // router.refresh();

      // center student
      if (response?.student?.type === 3 && response?.student?.has_center) {
        router.push(`bundles/${response?.student?.center_id}`);
        return;
      }

      if (response?.student?.type === 4 || response?.student?.type === 5) {
        router.push(
          redirectPath || `bundles?grade=${response?.student?.grade}`,
        );
        return;
      }

      router.push(redirectPath || "/profile");
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        response?: {
          error?: { message?: string };
          data?: { message?: string };
        };
      };

      if (error?.status === 409) {
        toast({
          icon: "error",
          description: "رقم الهاتف غير مفعل",
        });
        modal.setDialogContent(
          <OTPNotVerifIed
            defaultPhone={{
              phone: values.phone.phone,
              country: values.phone.country,
            }}
          />,
        );
        modal.openModal();
        return;
      }

      const errMessage =
        error?.response?.error?.message || error?.response?.data?.message;

      toast({
        description:
          error?.status !== 500
            ? errMessage || "حدث خطأ ما"
            : "حدث خطاء ما اثناء تسجيل الدخول",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { onSubmit, isLoading };
}
