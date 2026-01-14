"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomLoader from "../custom/Loader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const schema = z.object({
  code: z.string().min(1, "من فضلك ادخل الكود").max(100, "الكود غير صحيح"),
  room_id: z.string().min(1, "من فضلك ادخل رقم الغرفة"),
  center_id: z.string().min(1, "من فضلك ادخل رقم السنتر"),
});

const RoomPaymentForm = ({ roomId, centerId }) => {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      room_id: roomId,
      center_id: centerId,
      code: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (v) => {
    try {
      const response = await axios.post("/api?url=students/subscribe-room", {
        code: v.code.trim(),
        room_id: roomId,
        center_id: centerId,
      });

      console.log("response : ", response);

      toast({
        description: "تم دفع قيمه الكورس بنجاح",
        icon: "success",
      });
      router.push(`/bundles/${centerId}`);
    } catch (e) {
      toast({
        description:
          e?.data?.error?.errors?.code[0] ||
          e?.data?.error.message ||
          "كود غير صحيح",
        icon: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-1">
      <div className="border-primary-800 bg-background flex flex-col gap-1 rounded-lg border p-4">
        <Label
          aria-invalid={errors.code ? true : false}
          className="text-gray-dark"
        >
          الكود
        </Label>

        <div className="flex w-full items-start gap-4 sm:gap-6">
          <div className="flex-1">
            <Input
              type="text"
              name="code"
              className=""
              placeholder="أدخل الكود"
              aria-invalid={errors.code ? true : false}
              {...register("code")}
            />
            {errors.code && (
              <span className="text-sm text-red-700"> من فضلك ادخل الكود</span>
            )}
          </div>

          <Button
            type="submit"
            className="h-11 sm:w-full sm:max-w-[125px]"
            disabled={isSubmitting}
          >
            {!isSubmitting ? "إدخال" : <CustomLoader />}
          </Button>
        </div>
      </div>

      <p className="text-lg font-bold">أدخل الكود لتتمكن من عرض محتوى الباقة</p>
    </form>
  );
};
export default RoomPaymentForm;
