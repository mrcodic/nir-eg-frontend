"use client";

import AuthContext from "@/context/auth-context";
import { getDataClient, getGuestData } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useContext, useEffect, useState } from "react";
import { PaymentModel } from "./modals/PaymentModel";

const BundlesCom = ({ bundles }) => {
  const [isSubscribeNow, setIsSubscribeNow] = useState(false);
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState(0);
  const router = useRouter();

  const { token } = useContext(AuthContext);
  const [BundlesData, setBundlesData] = useState([]);

  let api = "";
  if (token) {
    api = "/students/bundles";
  } else {
    api = `/guest/bundels?grade_id=${searchParams.get("grade")}`;
  }

  const { data: profileData, isLoading } = useQuery({
    queryFn: getDataClient,
    queryKey: ["/students/profile"],
  });

  const { data } = useQuery({
    queryKey: [api],
    queryFn: token ? getDataClient : getGuestData,
    gcTime: 0,
    enabled: !isLoading && profileData?.body?.type !== 5,
    // suspense: true,
  });

  useEffect(() => {
    if (token) {
      setBundlesData(data?.body?.budles);
    } else {
      setBundlesData(data?.body);
    }
  }, [token, data]);

  console.log("bundles query data : ", api, data);

  if (!BundlesData?.length) return null;

  return (
    <div className="w-[85%] mx-auto">
      {BundlesData?.length > 0 && (
        <div className="mb-[24px] flex  gap-[24px]">
          <img
            className="md:w-[40px] md:h-[40px] w-[32px] h-[32px]"
            src={"/assets/english-icon.svg"}
          />
          <div className="flex flex-col">
            <div className="relative font-bold -top-2 text-nowrap">
              {" "}
              <h3
                style={{
                  WebkitTextFillColor: "white",
                  WebkitTextStrokeWidth: 1,
                  WebkitTextStrokeColor: "#d9b45c",
                }}
                className="textStroke text-[20px] md:text-[28px] absolute flex items-center -top-[2px]  z-0"
              >
                {" "}
                الباقات
              </h3>
              <h3 className="text-color-primary flex items-center absolute z-10 text-[20px] md:text-[28px]">
                الباقات
              </h3>
            </div>
            <p className="text-[#454545] text-[16px] md:text-[20px] font-medium mt-[22px] md:mt-[40px]">
              أحدث الباقات المضافة
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-[24px]">
        {BundlesData?.map((bundle, index) => {
          return (
            <div
              key={index}
              className="flex flex-col md:flex-row md:gap-[24px]"
            >
              {bundle?.cover && (
                <div className=" w-[335px] md:w-[368px]  bg-background rounded-[7.283px]">
                  <img
                    className=" md:w-[219px] h-[182.065px] w-[199.361px] md:h-[200px] mx-auto "
                    src={bundle?.cover}
                  />
                </div>
              )}
              {!bundle?.cover && <img src={"/assets/grade-placeholder.png"} />}
              <div
                style={{
                  boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
                }}
                className={`flex-1 border rounded-[8px] p-4 ${
                  bundle?.sale?.id ? "border-[#1EAD7B]" : "border-primary-700"
                }  `}
              >
                <div className="flex w-full items-center justify-between gap-[24px]">
                  <h2 className="text-[#121212] text-[14px] md:text-[18px] font-bold">
                    {bundle.name}
                  </h2>
                  {!bundle.sale?.id && !bundle.is_subscribed && (
                    <div className="bg-[#523412] text-center w-[111px] py-[4px] px-[8px] font-bold text-[12px] md:text-[18px] rounded-[8px] text-white">
                      {bundle.price} جنيه
                    </div>
                  )}
                  {bundle.sale?.id && !bundle.is_subscribed && (
                    <div className="flex font-bold text-[12px] md:text-[18px] gap-[24px]">
                      <div className="bg-[#454545] font-bold text-white py-[4px] px-[8px] line-through rounded-[8px]">
                        {bundle.price} جنيه
                      </div>
                      <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-[8px]">
                        {bundle.sale?.discount_type === 0
                          ? ((100 - bundle.sale?.discount_value) / 100) *
                            bundle.price
                          : bundle.price - bundle.sale?.discount_value}{" "}
                        جنيه
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-px w-full bg-primary-700 my-[12px]" />
                <div className="flex text-[14px] md:text-[16px] gap-1  md:gap-[8px]">
                  <span className="text-[#454545] inline-block">تحتوى على</span>

                  <span className="text-[#523412] inline-block font-bold">
                    {bundle.classrooms
                      .map((classroom) => classroom.title)
                      .join(" و ")}
                  </span>
                </div>
                <div className="mt-[16px] flex gap-[40px]">
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-[16px] h-[16px]"
                      src="/assets/create.svg"
                    />
                    <span className="text-[#523412] text-[10px]">
                      {new Date(bundle?.created_at).toISOString().split("T")[0]}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  {!bundle.is_subscribed && (
                    <div className="flex gap-[24px] text-[14px] font-bold mt-[32px]">
                      <button
                        onClick={() => {
                          setSelectedId(bundle.id);
                          if (token) {
                            setIsSubscribeNow(true);
                          } else {
                            router.push("/register");
                          }
                        }}
                        className="w-[116px] rounded-[8px] h-[3 text-white border border-[#9D8242] bg-color-primary text-[14px] font-bold"
                      >
                        اشترك الآن
                      </button>
                      <button
                        onClick={() => {
                          router.push(`/bundles/showBundle?type=${bundle.id}`);
                        }}
                        className="w-[116px] rounded-[8px] h-[32px] text-[#121212] border border-color-primary  text-[14px] font-bold"
                      >
                        عرض الباقة
                      </button>
                    </div>
                  )}

                  {bundle.is_subscribed === true && (
                    <div className="w-[116px] rounded-[8px] flex items-center justify-center py-1 mt-[24px] text-white border border-[#9D8242] bg-color-primary text-[14px] font-bold">
                      مشترك
                    </div>
                  )}

                  {bundle.sale?.id && !bundle.is_subscribed && (
                    <div>
                      <div className="flex gap-2 items-center">
                        <h2 className="text-[#121212] text-[14px] font-bold">
                          احصل على خصم
                        </h2>
                        <div className="bg-[url(/assets/sale?.svg)] flex items-center justify-center w-[32px] h-[32px]">
                          <div className="text-center flex items-center justify-center">
                            <div className="bg-[url(/assets/Sale.svg)] re bg-cover flex items-center justify-center w-[48px] h-[48px]">
                              <div className="text-center flex items-center justify-center">
                                <span
                                  style={{
                                    textShadow:
                                      "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                                  }}
                                  className="mt-[2px] inline-block text-white text-center text-[14px]"
                                >
                                  {bundle.sale?.discount_type === 0
                                    ? bundle.sale?.discount_value + "%"
                                    : bundle.sale?.discount_value + "جنيه"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex text-[12px] gap-2 items-center">
                        <span className="text-[12px] text-[#454545]">
                          متاح لمدة
                        </span>
                        <div className="flex  text-[#B75050] font-bold underline">
                          <span>{bundle?.sale?.duration}</span>
                          <span>ايام</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/*         
        {data?.body.map((bundle, index) => (
          <div className="flex flex-col md:flex-row md:gap-[24px]">
            <img className=" w-full lg:w-[368px]" src="/assets/grade-placeholder.png" />
            <div
              style={{
                boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
              }}
              className={`flex-1 border rounded-[8px] p-4 ${
                bundle?.sale?.id ? "border-[#1EAD7B]" : "border-primary-700"
              }  `}
            >
              <div className="flex w-full justify-between gap-[24px]">
                <h2 className="text-[#121212] text-[18px] font-bold">
                  {bundle.name}
                </h2>
                {!bundle.sale?.id && (
                  <div className="bg-[#523412] text-center w-[111px] py-[2px] px-[8px] text-[18px] rounded-[8px] text-white">
                    {bundle.price} جنيه
                  </div>
                )}
                {bundle.sale?.id && (
                  <div className="flex gap-[24px]">
                    <div className="bg-[#454545] font-bold text-white py-[2px] px-[8px] line-through rounded-[8px]">
                      {bundle.price} جنيه
                    </div>
                    <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-[8px]">
                      {bundle.sale?.discount_type === 0
                        ? ((100 - bundle.sale?.discount_value) / 100) *
                          bundle.price
                        : bundle.price - bundle.sale?.discount_value}{" "}
                      جنيه
                    </div>
                  </div>
                )}
              </div>
              <div className="h-px w-full bg-primary-700 my-[12px]" />
              <div className="flex text-[16px]  gap-[8px]">
                <span className="text-[#454545] inline-block">تحتوى على</span>

                <span className="text-[#523412] inline-block font-bold">
                  {bundle.classrooms
                    .map((classroom) => classroom.title)
                    .join(" و ")}
                </span>
              </div>
              <div className="mt-[16px] flex gap-[40px]">
                <div className="flex gap-2 items-center">
                  <img className="w-[16px] h-[16px]" src="/assets/Create.svg" />
                  <span className="text-[#523412] text-[10px]">
                    {new Date(bundle?.created_at).toISOString().split("T")[0]}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <img className="w-[16px] h-[16px]" src="/assets/Create.svg" />
                  <span className="text-[#523412] text-[10px]">
                    {new Date(bundle?.updated_at).toISOString().split("T")[0]}
                  </span>
                </div>
              </div>
              <div className="flex justify-between flex-wrap gap-4">
                <div className="flex gap-[24px] text-[14px] font-bold mt-[32px]">
                  <button
                    onClick={() => {
                      setSelectedId(bundle.id);
                      if (token) {
                        setIsSubscribeNow(true);
                      } else {
                        router.push("/register");
                      }
                    }}
                    className="w-[116px] rounded-[8px] h-[3 text-white border border-[#9D8242] bg-color-primary text-[14px] font-bold"
                  >
                    اشترك الآن
                  </button>
                  <button
                    onClick={() => {
                      router.push(`/bundles/showBundle?type=${bundle.id}`);
                    }}
                    className="w-[116px] rounded-[8px] h-[32px] text-[#121212] border border-color-primary  text-[14px] font-bold"
                  >
                    عرض الباقة
                  </button>
                </div>
                {bundle.sale?.id && (
                  <div>
                    <div className="flex gap-1 items-center">
                      <h2 className="text-[#121212] text-[14px] font-bold">
                        احصل على خصم
                      </h2>
                      <div className="bg-[url(/assets/sale?.svg)] flex items-center justify-center w-[32px] h-[32px]">
                        <div className="text-center flex items-center justify-center">
                          <span
                            style={{
                              textShadow:
                                "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                            }}
                            className="mt-[2px] inline-block text-white text-center text-[14px]"
                          >
                            {bundle.sale?.discount_type === 0
                              ? bundle.sale?.discount_value + "%"
                              : bundle.sale?.discount_value + "جنيه"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getDuration(
                      bundle.sale?.start_date,
                      bundle.sale?.end_date
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))} */}
        <PaymentModel
          open={isSubscribeNow}
          setOpen={setIsSubscribeNow}
          bundleId={selectedId}
          price={BundlesData?.price || BundlesData?.latest_room?.price}
        />
      </div>
    </div>
  );
};

export default BundlesCom;
