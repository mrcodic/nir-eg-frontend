import CustomInput from "@/components/custom/customInput";
import Link from "next/link";

function ChangePasswordSettings({ form }: { form: any }) {
  return (
    <div className="mt-4 flex flex-col justify-between gap-[10px]">
      <>
        <CustomInput
          name="old_password"
          control={form.control}
          label="كلمة السر القديمة"
          type="password"
        />

        <Link
          href="/forgetPassword"
          className="mt-[12px] inline-block cursor-pointer text-[12px] font-normal text-[#523412] underline"
        >
          هل نسيت كلمة السر؟
        </Link>
      </>

      <CustomInput
        name="password"
        control={form.control}
        label="كلمة السر الجديدة"
        type="password"
      />

      <CustomInput
        name="password_confirmation"
        control={form.control}
        label="تأكيد كلمة السر"
        type="password"
      />
    </div>
  );
}

export default ChangePasswordSettings;
