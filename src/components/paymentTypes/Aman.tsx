"use client";
import { payDataStore } from "@/app/store/pay";
import { formatDateToArabic } from "@/utils/clientFun";
import CopyButton from "../custom/CopyToClipBoard";

export default function Aman() {
  const data = payDataStore((state) => {
    return state.data;
  });

  return (
    <div>
      <h3 className="text-[18px] font-bold text-[#121212] mt-[56px]">
        كود الدفع الخاص بك:
      </h3>
      <div className="border mt-[16px]  rounded-[8px] border-color-primary py-[32px] px-[40px]">
        <h4 className="text-[14px] text-[#121212] font-medium">
          الكود المرجعي الخاص بك:
        </h4>
        <div className="flex justify-between">
          <h3 className="text-[#523412] text-[24px] font-bold mt-[8px]">
            {data?.body?.kiosk_reference || data?.kiosk_reference}
          </h3>
          <CopyButton
            text={data?.body?.kiosk_reference || data?.kiosk_reference}
          />
        </div>
      </div>
      <p className="text-[#523412] font-bold text-[14px] my-[16px]">
        سيتم فتح الحصة أو الكورس خلال 30 دقيقة من إتمام عملية الدفع
      </p>
      <div className="flex flex-col">
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className="p-4 flex gap-[16px] bg-background border text-[14px] font-bold text-[#523412] border-primary-700 rounded-[8px]"
        >
          <img src="/assets/WarningColor.svg" />
          <div>
            <p>
              يرجى التأكد من ادخال الكود بطريقة صحيحة و الاحتفاظ بإيصال الدفع.
            </p>
            <p>
              هذا الكود صالح ل{" "}
              <span dir="ltr">
                {formatDateToArabic(
                  data?.body?.expiration_time || data?.expiration_time
                )}
              </span>{" "}
              .
            </p>
          </div>
        </div>
        <div className="flex mt-[16px] gap-[24px]">
          <div
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
            }}
            className="p-4 flex-1 items-center flex gap-[16px] bg-background border text-[14px] font-bold text-[#523412] border-primary-700 rounded-[8px]"
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
            className="p-4 pb-0 flex-1 justify-between items-center flex gap-[16px] bg-background border text-[14px] font-bold text-[#523412] border-primary-700 rounded-[8px]"
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
