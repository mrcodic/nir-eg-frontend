import CustomInput from "@/components/custom/customInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";

function ChangePasswordSettings({
  form,
  profile,
  changePassword,
  setIsChangePassword,
}: {
  form: any;
  profile: any;
  changePassword: any;
  setIsChangePassword: any;
}) {
  return (
    <div className="mt-8 flex-1">
      <Accordion
        type="single"
        collapsible
        value={changePassword ? "password" : ""}
        onValueChange={(val) => setIsChangePassword(val === "password")}
        className="w-full"
      >
        <AccordionItem
          value="password"
          className="border-gray-light rounded-xl border bg-gray-50/50 px-4 md:px-6"
        >
          <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
            <div className="flex items-center gap-4">
              <div className="bg-primary-50 flex size-12 items-center justify-center rounded-xl">
                <LockKeyhole className="text-primary-800 size-6" />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-base font-bold text-black">
                  تغيير كلمة المرور
                </span>
                <span className="text-gray-dark text-xs font-normal">
                  آخر تحديث: {profile?.updated_at || "--"}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <div className="border-gray-light mb-6 border-t"></div>
            <div className="mt-4 flex flex-col justify-between gap-2.5">
              <>
                <CustomInput
                  name="old_password"
                  control={form.control}
                  label="كلمة السر القديمة"
                  type="password"
                />

                <Link
                  href="/forgetPassword"
                  className="inline-block cursor-pointer text-xs font-normal text-black underline"
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default ChangePasswordSettings;
