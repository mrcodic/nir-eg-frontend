"use client";
import { payDataStore } from "@/context/pay";
import { formatDateToArabic } from "@/utils/clientFun";
import CopyButton from "../custom/CopyToClipBoard";

export default function Aman() {
  const data = payDataStore((state) => {
    return state.data;
  });

  return (
    <div>
      <h3 className="mt-[56px] text-[18px] font-bold text-[#121212]">
        كود الدفع الخاص بك:
      </h3>
      <div className="border-primary mt-[16px] rounded-lg border px-[40px] py-[32px]">
        <h4 className="text-sm font-medium text-[#121212]">
          الكود المرجعي الخاص بك:
        </h4>
        <div className="flex justify-between">
          <h3 className="mt-[8px] text-[24px] font-bold text-[#523412]">
            {data?.body?.kiosk_reference || data?.kiosk_reference}
          </h3>
          <CopyButton
            text={data?.body?.kiosk_reference || data?.kiosk_reference}
          />
        </div>
      </div>
      <p className="my-[16px] text-sm font-bold text-[#523412]">
        سيتم فتح الحصة أو الكورس خلال 30 دقيقة من إتمام عملية الدفع
      </p>
      <div className="flex flex-col">
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className="bg-background border-gray-light flex gap-[16px] rounded-lg border p-4 text-sm font-bold text-[#523412]"
        >
          <img src="/assets/icons/WarningColor.svg" />
          <div>
            <p>
              يرجى التأكد من ادخال الكود بطريقة صحيحة و الاحتفاظ بإيصال الدفع.
            </p>
            <p>
              هذا الكود صالح ل{" "}
              <span dir="ltr">
                {formatDateToArabic(
                  data?.body?.expiration_time || data?.expiration_time,
                )}
              </span>{" "}
              .
            </p>
          </div>
        </div>
        <div className="mt-[16px] flex gap-[24px]">
          <div
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
            }}
            className="bg-background border-gray-light flex flex-1 items-center gap-[16px] rounded-lg border p-4 text-sm font-bold text-[#523412]"
          >
            <div>
              <p>
                يرجى التوجه إلى أقرب منفذ فوري، وأدخل الكود الخاص بك لإتمام
                عملية الدفع.
              </p>
            </div>
            <img src="/assets/amanMachine.svg" />
          </div>
          <div
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
            }}
            className="bg-background border-gray-light flex flex-1 items-center justify-between gap-[16px] rounded-lg border p-4 pb-0 text-sm font-bold text-[#523412]"
          >
            <div>
              <p>أو ادفع عن طريق تطبيق أمان</p>
            </div>
            <img src="/assets/amanMob.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}
