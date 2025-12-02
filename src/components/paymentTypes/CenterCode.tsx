"use client";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function CenterCode({ data, phoneNumber, message }) {
  const search = useSearchParams();
  const bundleId = search.get("bundleId");
  const courseId = search.get("courseId");

  const { data: vNumbers, isLoading } = useQuery({
    queryFn: getClientPrivateData,
    queryKey: [`/wallets`],
  });
  console.log("🚀 ~ CenterCode ~ vNumbers:", vNumbers);

  return (
    <div>
      <section>
        {/* <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className="mt-[56px] rounded-lg border py-[32px] px-10 md:px-[40px] border-primary"
        >
          {bundleId && (
            <PaymentBundlesForm
              gradeId={data?.body?.grade?.id || data?.grade?.id}
              id={data?.body?.id}
            />
          )}{" "}
          {courseId && (
            <PaymentForm grade={data?.body?.grade?.id || data?.grade?.id} />
          )}
        </div> */}
        {/* <h3 className="mt-[16px] text-[18px]">
        أدخل الكود لتتمكن من عرض محتوى الباقة , للحصول علي الكود من خلال السنتر
        </h3> */}
        {/* <div className="my-[48px] flex items-center justify-center   w-full gap-4">
          <div className="bg-gray-light h-px w-full" />
          <span className="text-[#523412] text-[16px]">أو</span>
          <div className="bg-gray-light h-px w-full" />
        </div>
        <div className="flex flex-wrap gap-[24px] items-center">
          <img className="w-[144px]" src="/assets/Vodafone-cash.svg" />
          <p className="text-[#121212] text-[20px] font-bold">
            <ul className="flex flex-col gap-4">
              <li>للحصول على كود : من خلال السنتر</li>
              {/* {vNumbers?.body?.length > 0 && (
                <li>
                  ١- حول تمن الباقه فودافون كاش للرقم ده{" "}
                  {vNumbers?.body?.map((number: string, id: number) => {
                    return (
                      <React.Fragment key={number}>
                        <span className="form-link">{number}</span>{" "}
                        {id < vNumbers?.body?.length - 1 && "او ده"}
                      </React.Fragment>
                    );
                  })}
                </li>
              )} */}
        {/* <li>
              {/* <li>
                او تحويل عن طريق انستاباي :{" "}
                <span className="form-link">tahoonmai88@instapay</span>
              </li> */}

        {/* <li>٢- احتفظ ب screenshot التحويل</li> */}

        {/* <li>
              {/* <li>٢- احتفظ ب screenshot التحويل</li> */}

        {/* <li>
                ٣-{" "}
                <a
                  href={`https://wa.me/${phoneNumber}?text=${message}`}
                  target="_blank"
                  className="underline"
                >
                  <span>تواصل معنا واتساب</span>
                </a>{" "}
                و ابعت السكرين شوت هيتم ارسال الكود ليك خلال ٢٤ ساعة ( اوقات
                العمل من ١٠ صباحا الي ١ ليلا)
              </li> 
            </ul>
          </p>
        </div> 
        {/* <div className="mt-[24px] items-center flex gap-[24px]">
          <img className="w-[32px] h-[32px]" src="/assets/Whatsapp.svg" />
          <span className="text-[18px] font-bold">
            تواصل معنا عبر تطبيق واتساب
          </span>
        </div> */}
        {/* <div className="w-full mx-auto flex items-center justify-center ">
          <WhatsAppContact phoneNumber={phoneNumber} message={message} />
        </div> */}
      </section>
    </div>
  );
}
