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
import { cn, getPhoneInfoFromCode } from "@/lib/utils";
import { mapTypeToText } from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import StudentCenterField from "@/components/custom/StudentCenterField";
import { useAuthContext } from "@/context/auth-context";
import { mutateClient } from "@/helpers/post-client";
import ChangePasswordSettings from "@/modules/profile/components/ChangePasswordSettings";

const PageSettings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const onSubmit = async (values: any) => {
    try {
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

      const formData = new FormData();

      if (values.parent_phone) {
        formData.append("parent_phone", values.parent_phone.phone);
        formData.append("country", values.parent_phone.country);
        formData.append("country_iso", values.parent_phone.country_iso);
      }

      if (values.center_id && profile?.type === 3) {
        formData.append("center_id", String(values.center_id));
      }

      const ignoredKeys = new Set(["parent_phone", "center_id"]);

      Object.entries(values).forEach(([key, value]) => {
        if (ignoredKeys.has(key)) return;
        if (value === undefined || value === null || value === "") return;

        if (key === "avatar" && value instanceof File) {
          formData.append("avatar", value);
          return;
        }

        if (typeof value !== "object") {
          formData.append(key, String(value));
        }
      });

      const response = await mutateClient("/students/profile/edit", {
        body: formData,
        auth: true,
      });

      if (response?.code === 200) {
        toast({
          description: "تم حفظ التغييرات بنجاح",
          icon: "success",
        });

        queryClient.invalidateQueries({
          queryKey: ["/students/profile"],
        });

        setIsChangePassword(false);
        setSelectedFile(null);
        form.reset();
        router.refresh();
      }
    } catch (err: any) {
      toast({
        description: err?.response?.data?.error?.message || "حدث خطأ ما",
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("mt-10 w-full", {
              "pointer-events-none animate-pulse": isLoading,
            })}
          >
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

                {/* {profile?.parent_phone_verification === false && (
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
                )} */}
              </div>

              <div className="mt-6 flex w-full flex-col items-center gap-6 md:flex-row">
                <CustomCityStateField form={form} />
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
                        shouldDirty: true,
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

              <Button
                type="submit"
                disabled={
                  isLoading || !Object.keys(form.formState.dirtyFields).length
                }
                className="mt-10 w-full max-w-[172px]"
              >
                {isLoading ? (
                  <SmallSpinner className="text-white" />
                ) : (
                  "حفظ التغيرات"
                )}
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
