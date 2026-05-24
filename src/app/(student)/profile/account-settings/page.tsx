"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import SmallSpinner from "@/components/custom/SmallSpinner";
import StudentCenterField from "@/components/custom/StudentCenterField";
import UploadWithCrop from "@/components/shared/UploadImage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { mapTypeToText } from "@/utils/clientFun";

import AccountSettingsDynamicFields from "@/modules/profile/components/AccountSettingsDynamicFields";
import ChangePasswordSettings from "@/modules/profile/components/ChangePasswordSettings";
import { useAccountSettingsForm } from "@/modules/profile/hooks/useAccountSettingsForm";

const AccountSettings = () => {
  const {
    profile,
    form,
    submit,
    isSubmitting,
    selectedFile,
    setSelectedFile,
    changePassword,
    setIsChangePassword,
    dynamicFields,
    dynamicFieldKeys,
    isFieldsLoading,
  } = useAccountSettingsForm();

  const shouldShowParentPhone = !dynamicFieldKeys.has("parent_phone");
  const shouldShowCityState =
    !dynamicFieldKeys.has("state_id") && !dynamicFieldKeys.has("city_id");
  const shouldShowStaticStudentType = !dynamicFieldKeys.has("student_type");

  return (
    <div className="wrapper mt-[168px] mb-12">
      <div className="border-gray-light mx-auto w-full rounded-lg border p-4 md:max-w-[792px]">
        <h1 className="text-xl font-bold">إعدادات الحساب</h1>

        <Form {...form}>
          <form
            onSubmit={submit}
            className={cn("mt-10 w-full", {
              "pointer-events-none animate-pulse":
                isSubmitting || isFieldsLoading,
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

              {shouldShowParentPhone && (
                <div className="flex w-full flex-col gap-2">
                  <CustomPhoneInput
                    name="parent_phone.phone"
                    form={form}
                    label="رقم هاتف ولي الأمر"
                    countryFieldName="parent_phone.country"
                    countryISOFieldName="parent_phone.country_iso"
                    className="mt-6"
                  />
                </div>
              )}

              {shouldShowCityState && (
                <div className="mt-6 flex w-full flex-col items-center gap-6 md:flex-row">
                  <CustomCityStateField form={form} />
                </div>
              )}

              {profile?.type === 3 && (
                <StudentCenterField
                  onSelect={(value) => {
                    form.setValue(
                      "center_id",
                      typeof value === "string" ? value : value.value,
                      { shouldValidate: true, shouldDirty: true },
                    );
                  }}
                  disabled
                />
              )}

              <div className="mt-6 flex w-full flex-col items-center gap-6 md:flex-row">
                <CustomInput
                  control={form.control}
                  name="profile_grade"
                  disabled
                  label="المرحله"
                  defaultValue={profile?.grade_name}
                />
                {shouldShowStaticStudentType && (
                  <CustomInput
                    control={form.control}
                    name="profile_type"
                    disabled
                    label="نوع الحساب"
                    defaultValue={mapTypeToText(profile?.type)}
                  />
                )}
              </div>

              <ChangePasswordSettings
                form={form}
                profile={profile}
                changePassword={changePassword}
                setIsChangePassword={setIsChangePassword}
              />

              {isFieldsLoading ? (
                <div className="mt-8 flex min-h-24 items-center justify-center">
                  <SmallSpinner />
                </div>
              ) : (
                <AccountSettingsDynamicFields
                  form={form}
                  fields={dynamicFields}
                />
              )}

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !Object.keys(form.formState.dirtyFields).length
                }
                className="mt-10 w-full max-w-[172px]"
              >
                {isSubmitting ? (
                  <SmallSpinner className="text-white" />
                ) : (
                  "حفظ التغييرات"
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

export default AccountSettings;
