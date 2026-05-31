"use client";

import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import SmallSpinner from "@/components/custom/SmallSpinner";
import StudentCenterField from "@/components/custom/StudentCenterField";
import UploadWithCrop from "@/components/shared/UploadImage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ChangePasswordSettings from "@/modules/profile/components/ChangePasswordSettings";
import ProfileCompletionFields from "@/modules/profile/components/ProfileCompletionFields";
import { useAccountSettingsForm } from "@/modules/profile/hooks/useAccountSettingsForm";

function SkeletonField() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-14" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

function AccountSettingsFieldsSkeleton() {
  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-end justify-between gap-6">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="h-11 w-[98px]" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SkeletonField />
        <SkeletonField />
      </div>
      <SkeletonField />
      <SkeletonField />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SkeletonField />
        <SkeletonField />
      </div>
      <SkeletonField />

      <Skeleton className="mt-8 h-[114px] w-full" />
      <Skeleton className="mt-10 h-12 w-40" />
    </div>
  );
}

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
    isFieldsLoading,
  } = useAccountSettingsForm();

  const hasExistingCenter =
    profile?.center_id !== null && profile?.center_id !== undefined;

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
            {isFieldsLoading ? (
              <AccountSettingsFieldsSkeleton />
            ) : (
              <>
                <div className="flex gap-6">
                  <UploadWithCrop
                    defaultAvatar={profile?.avatar}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    setValue={form.setValue}
                  />
                </div>

                <div className="mt-10">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomInput
                      control={form.control}
                      name="first_name"
                      label="الاسم الأول"
                    />

                    <CustomPhoneInput
                      name="phone.phone"
                      form={form}
                      label="رقم الهاتف"
                      countryFieldName="phone.country"
                      countryISOFieldName="phone.country_iso"
                    />

                    <ProfileCompletionFields
                      form={form}
                      fields={dynamicFields}
                    />

                    {profile?.type === 3 && (
                      <StudentCenterField
                        onSelect={(value) => {
                          form.setValue(
                            "center_id",
                            typeof value === "string" ? value : value.value,
                            { shouldValidate: true, shouldDirty: true },
                          );
                        }}
                        disabled={hasExistingCenter}
                      />
                    )}

                    <CustomInput
                      control={form.control}
                      name="grade_id"
                      disabled
                      label="المرحلة"
                      defaultValue={profile?.grade_name}
                    />
                  </div>

                  <ChangePasswordSettings
                    form={form}
                    profile={profile}
                    changePassword={changePassword}
                    setIsChangePassword={setIsChangePassword}
                  />

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
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountSettings;
