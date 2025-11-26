"use client";
import { useRouter } from "nextjs-toploader/app";

const PaymentWithFawery = () => {
  const router = useRouter();
  return (
    <div className="">
      {/*  */}

      <div
        className="mb-[48px] bg-[url(/assets/moreenglish.svg),url(/assets/Group-15.svg)] bg-no-repeat   mt-[100px]"
        style={{ backgroundPosition: "top right , top left" }}
      >
        <div className="">
          <h2 className="text-[20px] pt-[70px] mr-[50px] whitespace-nowrap font-bold">
            شراء الباقة
          </h2>
        </div>
        <div className="lg:w-[50%] flex justify-center mx-auto p-3  bg-no-repeat bg-left ">
          <div className="flex-1 font-bold ">
            <div className="flex flex-wrap items-center gap-[24px]">
              <div className="flex flex-wrap items-center gap-[12px]">
                <img
                  className="w-[24px] h-[24px]"
                  src="/assets/PaymentColor.svg"
                />
                <span>طريقة الدفع:</span>
              </div>
              <div className="flex items-center w-[320px] gap-[24px]">
                <img className="w-[96px] h-[32px]" src="/assets/Vodafone.svg" />
                <span> فودافون كاش</span>
              </div>
              <button className=" border text-sm flex justify-center  h-[36px] rounded-[10px] w-[250px] border-primary-800 text-[#121212] items-center gap-[12px]">
                <span>العودة لاختيار طريقة الدفع</span>
                <img
                  className="w-[24px] h-[24px]"
                  src="/assets/LeftArrowColor.svg"
                />
              </button>
            </div>
            <div className="mt-[40px] w-full">
              <div className="flex flex-col items-center md:flex-row gap-[24px]">
                <img
                  className="md:w-[156px] md:max-w-1/3 w-full  "
                  src="/assets/image-4.svg"
                />
                <div
                  style={{
                    boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
                  }}
                  className={`flex-1 border border-[#1EAD7B] rounded-lg p-4 `}
                >
                  <div className="flex w-full justify-between gap-[24px]">
                    <h2 className="text-[#121212] text-[18px] font-bold">
                      باقة شهر 10 و 11
                    </h2>
                  </div>
                  <div className="h-px w-full bg-gray-light my-[12px]" />
                  <div className="flex font-bold text-[16px]  gap-[8px]">
                    <span className="text-gray-dark inline-block">
                      تحتوى على
                    </span>
                    <span className="text-[#523412] inline-block font-bold">
                      كورس شهر 10
                    </span>
                    و
                    <span className="text-[#523412] inline-block font-bold">
                      كورس شهر 11
                    </span>
                  </div>
                  <div className="flex flex-wrap mt-[24px] justify-between items-center">
                    <div className="mt-[16px] flex-col flex gap-[10px]">
                      <div className="flex gap-2 items-center">
                        <img
                          className="w-[16px] h-[16px]"
                          src="/assets/Create.svg"
                        />
                        <span className="text-[#523412] text-[10px]">
                          15/01/2025
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <img
                          className="w-[16px] h-[16px]"
                          src="/assets/Create.svg"
                        />
                        <span className="text-[#523412] text-[10px]">
                          15/01/2025
                        </span>
                      </div>
                    </div>
                    <div className="flex mt-[20px] gap-[24px]">
                      <div className="bg-gray-dark font-bold text-white py-[2px] px-[8px] line-through rounded-lg">
                        200 جنيه
                      </div>
                      <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-lg">
                        100 جنيه
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-1 items-center">
                        <h2 className="text-[#121212] text-sm font-bold">
                          احصل على خصم
                        </h2>
                        <div className="bg-[url(/assets/Sale.svg)] flex items-center justify-center w-[32px] h-[32px]">
                          <div className="text-center flex items-center justify-center">
                            <span
                              style={{
                                textShadow:
                                  "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                              }}
                              className="mt-[2px] inline-block text-white text-center text-sm"
                            >
                              50%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[12px] text-gray-dark">
                          متاح لمدة
                        </span>
                        <span className="text-[#B75050] font-bold underline">
                          3 أيام، 16 ساعة
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#121212] mt-[56px]">
                  كود الدفع الخاص بك:
                </h3>
                <div className="border mt-[16px] rounded-lg border-primary py-[32px] px-[40px]">
                  <h4 className="text-sm text-[#121212] font-medium">
                    الكود المرجعي الخاص بك:
                  </h4>
                  <h3 className="text-[#523412] text-[24px] font-bold mt-[8px]">
                    123456789
                  </h3>
                </div>
                <p className="text-[#523412] font-bold text-sm my-[16px]">
                  سيتم فتح الحصة أو الكورس خلال 30 دقيقة من إتمام عملية الدفع
                </p>
                <div className="flex flex-col">
                  <div
                    style={{
                      boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
                    }}
                    className="p-4 flex gap-[16px] bg-background border text-sm font-bold text-[#523412] border-gray-light rounded-lg"
                  >
                    <img src="/assets/WarningColor.svg" />
                    <div>
                      <p>
                        يرجى التأكد من ادخال الكود بطريقة صحيحة و الاحتفاظ
                        بإيصال الدفع.
                      </p>
                      <p>هذا الكود صالح لمدة 30 دقيقة.</p>
                    </div>
                  </div>
                  <div className="flex mt-[16px] gap-[24px]">
                    <div
                      style={{
                        boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
                      }}
                      className="p-4 flex-1 items-center flex gap-[16px] bg-background border text-sm font-bold text-[#523412] border-gray-light rounded-lg"
                    >
                      <div>
                        <p>
                          يرجى التوجه إلى أقرب منفذ فوري، وأدخل الكود الخاص بك
                          لإتمام عملية الدفع.
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
                      }}
                      className="p-4 flex-1 justify-between items-center flex gap-[16px] bg-background border text-sm font-bold text-[#523412] border-gray-light rounded-lg"
                    >
                      <div>
                        <p>أو ادفع عن طريق تطبيق فوري</p>
                      </div>
                      <img src="/assets/FawryApp1.svg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex-1 font-bold mt-[140px] mr-[290px]">
          <div className="flex items-center gap-[24px]">
            <div className="flex items-center gap-[12px]">
              <img
                className="w-[24px] h-[24px]"
                src="/assets/PaymentColor.svg"
              />
              <span className="text-[18px] font-bold whitespace-nowrap">
                طريقة الدفع:
              </span>
            </div>
            <div className="flex justify-between w-full">
              <div className="flex items-center w-[320px] gap-[24px]">
                <img className="w-[96px] h-[32px]" src="/assets/Vodafone.svg" />
                <span> فودافون كاش</span>
              </div>
              <button
                onClick={() => router.push("/bundles")}
                className=" border text-sm flex justify-center  h-[36px] rounded-[10px] w-[250px] border-primary-800 text-[#121212] items-center gap-[12px]"
              >
                <span>العودة لاختيار طريقة الدفع</span>
                <img
                  className="w-[24px] h-[24px]"
                  src="/assets/LeftArrowColor.svg"
                />
              </button>
            </div>
          </div>
          <div className="mt-[40px] w-full">
            <div className="flex gap-[24px]">
              <img className="w-[156px]" src="/assets/image-4.svg" />
              <div
                style={{
                  boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
                }}
                className={`flex-1 border border-[#1EAD7B] rounded-lg p-4 `}
              >
                <div className="flex w-full justify-between gap-[24px]">
                  <h2 className="text-[#121212] text-[18px] font-bold">
                    باقة شهر 10 و 11
                  </h2>
                </div>
                <div className="h-px w-full bg-gray-light my-[12px]" />
                <div className="flex font-bold text-[16px]  gap-[8px]">
                  <span className="text-gray-dark inline-block">تحتوى على</span>
                  <span className="text-[#523412] inline-block font-bold">
                    كورس شهر 10
                  </span>
                  و
                  <span className="text-[#523412] inline-block font-bold">
                    كورس شهر 11
                  </span>
                </div>
                <div className="flex mt-[24px] justify-between items-center">
                  <div className="mt-[16px] flex-col flex gap-[10px]">
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-[16px] h-[16px]"
                        src="/assets/Create.svg"
                      />
                      <span className="text-[#523412] text-[10px]">
                        15/01/2025
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-[16px] h-[16px]"
                        src="/assets/Create.svg"
                      />
                      <span className="text-[#523412] text-[10px]">
                        15/01/2025
                      </span>
                    </div>
                  </div>
                  <div className="flex mt-[20px] gap-[24px]">
                    <div className="bg-gray-dark font-bold text-white py-[2px] px-[8px] line-through rounded-lg">
                      200 جنيه
                    </div>
                    <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-lg">
                      100 جنيه
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-1 items-center">
                      <h2 className="text-[#121212] text-sm font-bold">
                        احصل على خصم
                      </h2>
                      <div className="bg-[url(/assets/Sale.svg)] flex items-center justify-center w-[32px] h-[32px]">
                        <div className="text-center flex items-center justify-center">
                          <span
                            style={{
                              textShadow:
                                "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                            }}
                            className="mt-[2px] inline-block text-white text-center text-sm"
                          >
                            50%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[12px] text-gray-dark">
                        متاح لمدة
                      </span>
                      <span className="text-[#B75050] font-bold underline">
                        3 أيام، 16 ساعة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default PaymentWithFawery;
