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
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../ui/dialog";

export default function OtpModal({ open, setOpen, phone }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const initialSend = useRef(false);

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

      setOpen(false);

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

      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-8 max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="flex gap-2">
          <img
            src={true ? "/assets/LockColor.svg" : "/assets/Done.svg"}
            className="w-[32px] h-[32px]"
          />
          <div>
            <h3 className="text-[#121212] text-[20px] font-bold">
              تأكيد رقم الهاتف
            </h3>
            {/* <h3 className="text-[#121212] text-[20px] font-bold">
              تأكيد رقم هاتف ولي الأمر
            </h3> */}
            <div>
              <p className="text-[16px] font-medium mt-[4px] text-gray-dark">
                ٍسنقوم بإرسال رمز التأكيد إلى رقم الهاتف التالي
              </p>
              <span
                className="text-[#121212] font-bold inline-block  "
                dir="ltr"
              >
                {phone}
              </span>
              {/* <span className="text-[16px] font-medium mt-[8px] text-gray-dark">
                عبر تطبيق واتساب
              </span> */}
            </div>
          </div>
        </div>

        {/* <Button
          className="text-[#523412] cursor-pointer text-[18px] inline-block underline mt-[16px] font-bold bg-white w-fit hover:bg-white"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            sendOtp();
          }}
          disabled={start}
        >
          إرسال الرمز {resending && <CustomLoader />}
        </Button> */}

        <div className="h-px w-full mt-[16px] bg-gray-light" />

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
              className="text-[#523412] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-[18px]  underline flex items-center gap-1 mt-[16px] font-bold"
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
                      {/* <InputOTP maxLength={6} {...field} dir="ltr">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP> */}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-start! gap-6 items-center  w-full mt-20!">
              <Button
                className="bg-primary-800 border text-white font-bold border-gray-light h-[32px] w-[144px] rounded-lg"
                type="submit"
                onClick={() => {
                  setOpen(true);
                }}
              >
                {!form.formState.isSubmitting ? "   تأكيد" : <CustomLoader />}
              </Button>

              <DialogClose
                asChild
                className="flex items-center justify-center! w-full"
              >
                <Button
                  className=" border bg-white text-black hover:text-white  font-bold  h-[32px] w-[144px] rounded-lg"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  إلغاء
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
