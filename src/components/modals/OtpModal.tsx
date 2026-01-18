"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OTP_SEND_TIME_KEY } from "@/constants";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import useOtp from "@/hooks/useOtp";
import { otpSchema } from "@/lib/schemas";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import CustomLoader from "../custom/Loader";
import OTPInput from "../custom/OTPInput";
import CountDownTimerUI from "../ui/CountDownTimerUI";
import { DialogClose, DialogFooter } from "../ui/dialog";

export default function OtpModal({ phone }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const initialSend = useRef(false);
  const modal = useModal();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      phone: phone,
      otp_code: "",
    },
  });

  const { sendOtp, start, minutes, seconds, resending, isExpired } = useOtp();

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    try {
      await axios.post("/api?url=otp/verify", {
        ...data,
        phone,
      });

      toast({
        description: "تم تأكيد ررقم الهاتف بنجاح",
        icon: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["/students/profile"],
      });

      localStorage.removeItem(OTP_SEND_TIME_KEY);
      router.refresh();
    } catch (e) {
      console.log(e);
      toast({
        description: " رمز التأكيد غلط او وقته خلص",
        icon: "error",
      });
    } finally {
      modal.closeModal();
    }
  }

  useEffect(() => {
    if (!isExpired && !initialSend.current) {
      initialSend.current = true;
      return;
    }
    if (initialSend.current || !open) return;

    if (isExpired) {
      console.log("initialEnabled...........");
      initialSend.current = true;
      sendOtp(phone);
    }
  }, [isExpired, phone, sendOtp]);

  return (
    <div>
      <div className="flex gap-2">
        <Image
          src={start ? "/assets/icons/Done.svg" : "/assets/icons/LockColor.svg"}
          width={32}
          height={32}
          className="size-8"
          alt="otp modal icon"
        />
        <div>
          <h3 className="text-[20px] font-bold text-[#121212]">
            تأكيد رقم الهاتف
          </h3>

          <div>
            <p className="text-gray-dark mt-1 text-[16px] font-medium">
              {start ? "قمنا" : "سنقوم"} بإرسال رمز التأكيد إلى رقم الهاتف
              التالي
            </p>
            <span className="inline-block font-bold text-[#121212]" dir="ltr">
              {phone}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-light mt-4 h-px w-full" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {start && <CountDownTimerUI minutes={minutes} seconds={seconds} />}

          <button
            onClick={(e) => {
              e.preventDefault();
              sendOtp(phone);
            }}
            className="text-secondary mt-4 flex cursor-pointer items-center gap-1 text-base font-bold underline disabled:cursor-not-allowed disabled:opacity-60"
            disabled={start}
          >
            أعد الإرسال{" "}
            {resending && <Loader2 className="size-4 animate-spin" />}
          </button>

          <FormLabel className="block text-xl"> أدخل رمز التأكيد</FormLabel>

          <div className="text-32! flex justify-end" dir="ltr">
            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OTPInput
                      length={6}
                      form={form}
                      name="otp_code"
                      disabled={!start}
                    />
                  </FormControl>

                  {start && <FormMessage />}
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="mt-16! flex w-full items-center justify-start! gap-6">
            <Button
              className="bg-primary-800 border-gray-light h-8 w-36 rounded-lg border font-bold text-white"
              type="submit"
              disabled={!start}
            >
              {!form.formState.isSubmitting ? "   تأكيد" : <CustomLoader />}
            </Button>

            <DialogClose
              asChild
              className="flex w-full items-center justify-center!"
            >
              <Button
                className="h-8 w-36 rounded-lg border bg-white font-bold text-black hover:text-white"
                onClick={() => {
                  modal.closeModal();
                }}
              >
                إلغاء
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
