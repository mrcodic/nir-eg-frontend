"use client";

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
import { useToast } from "@/hooks/use-toast";
import { otpSchema } from "@/lib/schemas";
import { getOtp } from "@/utils/api";
import axios from "axios";
import { MyTimer } from "../CountdownTimer";
import OTPInput from "../custom/OTPInput";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../ui/dialog";

export default function OtpUserModal({
  open,
  setOpen,
  setResponse,
  parentPhone,
  status,
}) {
  const form = useForm<z.infer<typeof otpSchema>>({
    // resolver: zodResolver(otpSchema),

    defaultValues: {
      phone: parentPhone,
      otp_code: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    try {
      const response = await axios.post("/api?url=otp/verify", {
        phone: parentPhone,
        otp_code: data?.otp_code,
      });

      toast({
        description: "تم تأكيد ررقم الهاتف بنجاح",
        icon: "success",
      });

      setOpen(false);
      setResponse(response.status);
    } catch (e) {
      toast({
        description: " رمز التأكيد غلط او وقته خلص",
        icon: "error",
      });
    }
  }

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
              تأكيد رقم هاتف الطالب
            </h3>
            <div>
              <p className="text-[16px] font-medium mt-[4px] text-gray-dark">
                قمنا بإرسال رمز التأكيد إلى رقم الهاتف التالي
              </p>
              <span
                className="text-[#121212] font-bold inline-block  "
                dir="ltr"
              >
                {parentPhone}
              </span>
              <span className="text-[16px] font-medium mt-[8px] text-gray-dark">
                عبر تطبيق واتساب
              </span>
            </div>
          </div>
        </div>
        <div className="h-px w-full mt-[16px] bg-gray-light" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <div className="flex mt-[32px] gap-[24px] w-full">
              <div className=" flex-1 flex gap-2  items-center text-gray-dark ">
                <span className="text-[#121212] font-bold inline-block text-[18px]">
                  هذا الرمز صالح لمدة
                </span>
                <div className="text-[#B75050] font-bold text-[20px]">
                  {/* <span>{formatTime(minutes)}</span>:
                <span>{formatTime(seconds)}</span> */}
                  <MyTimer minutes={2} />
                </div>
              </div>
            </div>
            <div
              onClick={async () => {
                const res = await getOtp(parentPhone);
                if (res.status) {
                  // setResend(false);
                  toast({
                    description: "بعتنالك otp تاني   ",
                    icon: "success",
                  });
                }
              }}
              className="text-[#523412] cursor-pointer text-[18px] inline-block underline mt-[16px] font-bold"
              // disabled={resend}
            >
              أعد الإرسال
            </div>
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
              <DialogClose
                asChild
                className="flex items-center justify-center! w-full"
              >
                <Button
                  className="bg-primary-800 border text-white font-bold border-gray-light h-[32px] w-[144px] rounded-lg"
                  type="submit"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  تأكيد
                </Button>
              </DialogClose>
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
