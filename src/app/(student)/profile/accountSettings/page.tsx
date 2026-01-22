"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import UploadWithCrop from "@/components/UploadImage";
import { useToast } from "@/hooks/use-toast";
import { editProfileSchema } from "@/lib/schemas";
import { getPhoneInfoFromCode } from "@/lib/utils";
import { mapTypeToText } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import StudentCenterField from "@/components/custom/StudentCenterField";
import OtpModal from "@/components/modals/OtpModal";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import ChangePasswordSettings from "@/modules/profile/components/ChangePasswordSettings";
import Cookies from "js-cookie";

const PageSettings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const modal = useModal();

  const [changePassword, setIsChangePassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { profile } = useAuthContext();

  const phoneInfo = getPhoneInfoFromCode(profile?.code_country);

  const defaultData = useMemo(
    () => ({
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      parent_phone: {
        country: phoneInfo?.code || "",
        country_iso: phoneInfo?.isoCode || "",
        phone: profile?.parent_phone || "",
      },
      state_id: profile?.state_id ?? "",
      center_id: profile?.center_id ?? "",
      city_id: profile?.city_id ?? "",
      avatar: null,
      old_password: "",
      password: "",
      password_confirmation: "",
    }),
    [profile, phoneInfo],
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

      const { parent_phone, center_id, ...rest } = values;

      if (center_id && profile?.type === 3) {
        rest.center_id = center_id;
      }

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
        },
      );

      if (response?.data?.code === 200) {
        toast({
          description: "تم حفظ التغييرات بنجاح",
          icon: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
        setIsChangePassword(false);
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

  return (
    <div className="wrapper mt-[168px] mb-12">
      <div className="border-gray-light mx-auto w-full rounded-lg border p-4 md:max-w-[792px]">
        <h1 className="text-xl font-bold">إعدادات الحساب</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 w-full">
            <div className="flex gap-6">
              <UploadWithCrop
                defaultAvatar={profile?.avatar}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setValue={form.setValue}
              />
            </div>

            <div className="mt-10">
              <div className="flex w-full flex-col gap-6 md:flex-row">
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

              <div className="flex w-full flex-col gap-2">
                <CustomPhoneInput
                  name="parent_phone.phone"
                  form={form}
                  label="رقم هاتف ولي الأمر"
                  countryFieldName="parent_phone.country"
                  countryISOFieldName="parent_phone.country_iso"
                  className="mt-6"
                />

                {profile?.parent_phone_verification === false && (
                  <button
                    type="button"
                    onClick={async () => {
                      modal.setDialogContent(
                        <OtpModal phone={profile?.parent_phone} />,
                      );
                      modal.openModal();
                    }}
                    className="ms-auto inline-block w-fit cursor-pointer text-xs font-normal underline"
                  >
                    قم بتأكيد رقم ولي الأمر
                  </button>
                )}
              </div>

              <div className="mt-6 flex w-full flex-col items-center gap-6 md:flex-row">
                <CustomCityStateField form={form} isSettings />
              </div>

              {profile?.type === 3 && (
                <StudentCenterField
                  onSelect={(v) => {
                    console.log(v);
                    form.setValue(
                      "center_id",
                      typeof v === "string" ? v : v.value,
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                />
              )}

              <div className="mt-6 flex w-full flex-col items-center gap-6 md:flex-row">
                <CustomInput
                  control={form.control}
                  name="address"
                  disabled
                  label="المرحله"
                  defaultValue={profile?.grade_name}
                />
                <CustomInput
                  control={form.control}
                  name="address"
                  disabled
                  label="نوع الحساب"
                  defaultValue={mapTypeToText(profile?.type)}
                />
              </div>

              <div className="flex-1">
                <div className="flex w-full items-center justify-between">
                  <h4 className="text-gray-dark mt-8 mb-4 text-[12px] font-bold">
                    كلمة السر
                  </h4>
                  <span className="text-gray-dark mt-5 inline-block text-[12px] font-medium">
                    آخر تحديث: {profile?.updated_at}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChangePassword((t) => !t)}
                  className="mt-2 cursor-pointer text-sm font-medium text-[#523412] underline"
                >
                  {changePassword ? "إلغاء تغيير كلمة السر" : "تغيير كلمة السر"}
                </button>

                {changePassword && <ChangePasswordSettings form={form} />}
              </div>

              <Button type="submit" className="mt-10 w-full max-w-[172px]">
                {isLoading ? <SmallSpinner /> : "حفظ التغيرات"}
              </Button>

              {Object.values(form.formState.errors).length > 0 && (
                <p className="text-sm text-red-500">
                  يرجى ملء جميع الحقول المطلوبة
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default PageSettings;
