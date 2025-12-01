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
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import CustomLoader from "../custom/Loader";
import OTPInput from "../custom/OTPInput";
import CountDownTimerUI from "../forms/CountDownTimerUI";
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
      toast({
        description: " رمز التأكيد غلط او وقته خلص",
        icon: "error",
      });
    } finally {
      modal.closeModal();
    }
  }

  useEffect(() => {
    if (initialSend.current || !open) return;

    if (isExpired) {
      console.log("initialEnabled...........");
      initialSend.current = true;
      sendOtp(phone);
    }
  }, [isExpired, open]);

  return (
    <div>
      <div className="flex gap-2">
        <img
          src={true ? "/assets/LockColor.svg" : "/assets/Done.svg"}
          className="size-8"
        />
        <div>
          <h3 className="text-[#121212] text-[20px] font-bold">
            تأكيد رقم الهاتف
          </h3>
          {/* <h3 className="text-[#121212] text-[20px] font-bold">
              تأكيد رقم هاتف ولي الأمر
            </h3> */}
          <div>
            <p className="text-[16px] font-medium mt-1 text-gray-dark">
              ٍسنقوم بإرسال رمز التأكيد إلى رقم الهاتف التالي
            </p>
            <span className="text-[#121212] font-bold inline-block  " dir="ltr">
              {phone}
            </span>
            {/* <span className="text-[16px] font-medium mt-[8px] text-gray-dark">
                عبر تطبيق واتساب
              </span> */}
          </div>
        </div>
      </div>

      <div className="h-px w-full mt-4 bg-gray-light" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          {start && <CountDownTimerUI minutes={minutes} seconds={seconds} />}

          <button
            onClick={(e) => {
              e.preventDefault();
              sendOtp(phone);
            }}
            className="text-[#523412] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-[18px]  underline flex items-center gap-1 mt-4 font-bold"
            disabled={start}
          >
            أعد الإرسال {resending && <Loader2 className="animate-spin" />}
          </button>
          <FormLabel className="text-xl block "> أدخل رمز التأكيد</FormLabel>
          <div className=" flex justify-end text-32! " dir="ltr">
            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OTPInput length={6} form={form} name="otp_code" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="flex justify-start! gap-6 items-center  w-full mt-20!">
            <Button
              className="bg-primary-800 border text-white font-bold border-gray-light h-8 w-36 rounded-lg"
              type="submit"
            >
              {!form.formState.isSubmitting ? "   تأكيد" : <CustomLoader />}
            </Button>

            <DialogClose
              asChild
              className="flex items-center justify-center! w-full"
            >
              <Button
                className=" border bg-white text-black hover:text-white  font-bold  h-8 w-36 rounded-lg"
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
