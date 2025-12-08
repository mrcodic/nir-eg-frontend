import CustomInput from "@/components/custom/customInput";
import Link from "next/link";

function ChangePasswordSettings({ form }: { form: any }) {
  return (
    <div className="flex flex-col gap-[10px] justify-between mt-4">
      <>
        <CustomInput
          name="old_password"
          control={form.control}
          label="كلمة السر القديمة"
          type="password"
        />

        <Link
          href="/forgetPassword"
          className="text-[12px] cursor-pointer underline inline-block mt-[12px] font-normal text-[#523412]"
        >
          هل نسيت كلمة السر؟
        </Link>
        {/* <span
                          onClick={async () => {
                            const { isExpired } = isOtpExpired();
                            if (isExpired) {
                              await getOtp(data?.body?.phone);
                            }
                            setChangeUserNumber(true);
                          }}
                          className="text-[12px] cursor-pointer underline inline-block mt-[12px] font-normal text-[#523412]"
                        >
                          هل نسيت كلمة السر؟
                        </span> */}
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
