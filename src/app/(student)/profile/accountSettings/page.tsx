"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomLoader from "@/components/custom/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import UploadWithCrop from "@/components/UploadImage";
import { useToast } from "@/hooks/use-toast";
import { editProfileSchema } from "@/lib/schemas";
import { getPhoneInfoFromCode, isOtpExpired } from "@/lib/utils";
import { getOtp } from "@/utils/api";
import { mapGradeToText, mapTypeToText } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import StudentCenterField from "@/components/custom/StudentCenterField";
import { getClientPrivateData } from "@/helpers/client-fetch";
import ChangePasswordSettings from "@/modules/profile/components/ChangePasswordSettings";
import { ApiResponse, IUser } from "@/types";
import Cookies from "js-cookie";

const PageSettings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [changePassword, setIsChangePassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useQuery<ApiResponse<IUser>>({
    queryKey: ["/students/profile"],
    queryFn: getClientPrivateData,
    staleTime: 0,
  });

  console.log(data);

  const phoneInfo = getPhoneInfoFromCode(data?.body?.code_country);

  const defaultData = useMemo(
    () => ({
      first_name: data?.body?.first_name ?? "",
      last_name: data?.body?.last_name ?? "",
      parent_phone: {
        country: phoneInfo?.code || "",
        country_iso: phoneInfo?.isoCode || "",
        phone: data?.body?.parent_phone || "",
      },
      state_id: data?.body?.state_id ?? "",
      center_id: data?.body?.center_id ?? "",
      city_id: data?.body?.city_id ?? "",
      avatar: null,
      old_password: "",
      password: "",
      password_confirmation: "",
    }),
    [data, phoneInfo]
  );

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: defaultData,
    values: defaultData,
  });

  const onSubmit = async (values) => {
    try {
      const tokenCookie = Cookies.get("nir_token");
      // check if change password is active and now password fields are entered
      if (changePassword) {
        if (
          !values.password ||
          !values.password_confirmation ||
          !values.old_password
        ) {
          toast({
            description: "يرجى ادخال كلمة المرور الجديدة",
            icon: "error",
          });
          form.setError("password", {
            type: "manual",
            message: "يرجى ادخال كلمة المرور الجديدة",
          });
          return;
        }
      }

      setIsLoading(true);

      console.log(values);

      const { parent_phone, ...rest } = values;

      const response = await axios.post(
        "/api?url=/students/profile/edit&type=formData",
        {
          ...rest,
          parent_phone: parent_phone.phone,
          country: parent_phone.country,
          country_iso: parent_phone.country_iso,
        },
        {
          headers: {
            "content-type": "multipart/form-data",

            Authorization: `Bearer ${tokenCookie}`,
          },
        }
      );

      if (response?.data?.code === 200) {
        toast({
          description: "تم حفظ التغييرات بنجاح",
          icon: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      toast({
        description: err?.response?.data?.error?.message || "   حدث خطأ ما",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(form.getValues());

  return (
    <div className="mt-[168px] mb-12 wrapper ">
      <div className=" w-full md:max-w-[792px] mx-auto border border-gray-light p-4 rounded-lg">
        <h1 className="text-xl font-bold">إعدادات الحساب</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 w-full">
            <div className="flex gap-6">
              <UploadWithCrop
                defaultAvatar={data?.body?.avatar}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setValue={form.setValue}
              />
            </div>

            <div className="mt-10 ">
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-1">
                  <CustomInput
                    name="first_name"
                    control={form.control}
                    label="الاسم الأول"
                  />
                </div>
                <div className="flex-1">
                  <CustomInput
                    name="last_name"
                    control={form.control}
                    label="الاسم الأخير"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  gap-6 w-full">
                <CustomPhoneInput
                  name="parent_phone.phone"
                  form={form}
                  label="رقم هاتف ولي الأمر"
                  countryFieldName="parent_phone.country"
                  countryISOFieldName="parent_phone.country_iso"
                  className="mt-6"
                />

                {data?.body?.parent_phone_verification === false && (
                  <button
                    onClick={async () => {
                      const { isExpired } = isOtpExpired();
                      if (isExpired) {
                        await getOtp(data?.body?.parent_phone);
                      }
                      // setChangeParentNumber(true);
                    }}
                    className="text-xs cursor-pointer underline inline-block mt-2 font-normal "
                  >
                    قم بتأكيد رقم ولي الأمر
                  </button>
                )}
              </div>

              <div className="flex flex-col mt-6 md:flex-row items-center  gap-6 w-full">
                <CustomCityStateField form={form} isSettings />
              </div>

              {data?.body?.type === 3 && (
                <StudentCenterField
                  onSelect={(v) => {
                    console.log(v);
                    form.setValue(
                      "center_id",
                      typeof v === "string" ? v : v.value,
                      {
                        shouldValidate: true,
                      }
                    );
                  }}
                />
              )}

              <div className="flex flex-col mt-6 md:flex-row items-center  gap-6 w-full">
                <CustomInput
                  control={form.control}
                  name="address"
                  disabled
                  label="المرحله"
                  defaultValue={mapGradeToText(data?.body?.grade)}
                />
                <CustomInput
                  control={form.control}
                  name="address"
                  disabled
                  label="نوع الحساب"
                  defaultValue={mapTypeToText(data?.body?.type)}
                />
              </div>

              <div className="flex-1">
                <div className="w-full flex justify-between items-center ">
                  <h4 className="text-gray-dark mb-[16px] mt-[32px] text-[12px] font-bold">
                    كلمة السر
                  </h4>
                  <span className="text-gray-dark mt-[20px] inline-block text-[12px] font-medium">
                    آخر تحديث: {data?.body?.updated_at}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChangePassword((t) => !t)}
                  className="text-[#523412] cursor-pointer text-sm font-medium mt-[8px] underline"
                >
                  {changePassword ? "إلغاء تغيير كلمة السر" : "تغيير كلمة السر"}
                </button>

                {changePassword && <ChangePasswordSettings form={form} />}
              </div>

              <Button type="submit" className="mt-10 max-w-[172px] w-full">
                {isLoading ? <CustomLoader /> : "حفظ التغيرات"}
              </Button>

              {Object.values(form.formState.errors).length > 0 && (
                <p className="text-red-500 text-sm">
                  يرجى ملء جميع الحقول المطلوبة
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* {!data?.body?.parent_phone && changeParentNumber && (
        <OtpModal phone={data?.body?.parent_phone} />
      )} */}
    </div>
  );
};
export default PageSettings;
