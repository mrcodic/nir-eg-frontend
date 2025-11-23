"use client";
import CourseCard from "@/components/CourseCard";
import RoomHeader from "@/components/RoomHeader";
import { useAuthContext } from "@/context/auth-context";
import { getDataClient, getGuestData } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const ShowBundle = () => {
  const params = useSearchParams();
  const { token } = useAuthContext();

  const { data } = useQuery({
    queryKey: [`/bundles/${params.get("type")}`],
    queryFn: token ? getDataClient : getGuestData,
  });

  return (
    <div className="mt-[140px] mb-[24px] w-[85%] mx-auto">
      <RoomHeader
        width={"w-auto"}
        height={"h-auto"}
        icon={"/assets/Bundle.svg"}
        title={"محتويات الباقة"}
      />
      <div className="mt-[32px]">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-[#121212] text-[18px] font-bold">
            {data?.body?.name}
          </h2>

          <div className="flex items-end gap-[12px]">
            {/* <button
              onClick={() => setIsSubscribeNow(true)}
              className="bg-primary w-[120px] text-sm h-[30px] text-center flex items-center justify-center  py-1 border-2 border-gray-light px-[24px] rounded-[10px] text-white"
            >
              اشترك الآن
            </button> */}
            <div className="flex whitespace-nowrap">
              {data?.body?.sale?.id && (
                <div className="flex items-center ml-[12px] mt-[20px] gap-[24px]">
                  <div className="bg-gray-dark text-sm font-bold text-white py-[2px] px-[8px] line-through rounded-lg">
                    {data?.body?.price} جنيه
                  </div>
                  <div className="bg-[#1EAD7B] text-sm  text-center font-bold text-white py-[2px] px-[8px]  rounded-lg">
                    {data?.body?.sale?.discount_type === 0
                      ? ((100 - data?.body?.sale?.discount_value) / 100) *
                        data?.body?.price
                      : data?.body?.price -
                        data?.body?.sale?.discount_value}{" "}
                    جنيه
                  </div>
                </div>
              )}
              {!data?.body?.sale?.id && (
                <div className="bg-[#1EAD7B] text-sm  text-center font-bold text-white py-[2px] px-[8px]  rounded-lg">
                  {data?.body?.price}جنيه
                </div>
              )}
              {data?.body?.sale?.id && (
                <div className="flex flex-col gap-1 items-center">
                  <div className="flex items-center">
                    <h2 className="text-[#121212] ml-4 text-sm font-bold">
                      احصل على خصم
                    </h2>
                    <div className="bg-[url(/assets/Sale.svg)] flex items-center justify-center w-[32px] h-[32px]">
                      <div className="text-center flex items-center justify-center">
                        <div className="bg-[url(/assets/Sale.svg)]  bg-cover flex items-center justify-center w-[48px] h-[48px]">
                          <div className="text-center flex items-center justify-center">
                            <span
                              style={{
                                textShadow:
                                  "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                              }}
                              className=" inline-block font-bold text-white text-center text-sm"
                            >
                              {data?.body?.sale?.discount_type === 0
                                ? data?.body?.sale?.discount_value + "%"
                                : data?.body?.sale?.discount_value + "جنيه"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex text-[12px] gap-2 items-center">
                    <span className="text-[12px] text-gray-dark">
                      متاح لمدة
                    </span>
                    <div className="flex">
                      <span className="text-[#B75050] font-bold underline">
                        {data?.body?.sale?.duration}
                        أيام
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-gray-light h-px w-full my-[16px]" />
        <span className="text-gray-dark text-[18px] font-bold">تحتوى على </span>
        <div className="mt-[24px] gap-4  grid grid-cols-1  md:grid-cols-3 ">
          {data?.body?.classrooms.map((classroom) => (
            <>
              <CourseCard
                isBundles={true}
                isNewCourse={true}
                courseDetails={classroom}
              />
            </>
          ))}
        </div>
        {/* <div className="mt-[250px]  flex  flex-wrap  items-center justify-center flex-col w-full mx-auto">
          <div className="border font-bold  items-center flex flex-wrap  gap-[24px] rounded-lg  py-[32px] px-[40px] border-primary">
            <span className="text-[#523412] text-[24px] inline-block">
              ستقوم بتوفير
            </span>
            <div className="relative font-bold  text-nowrap">
              {" "}
              <h3
                style={{
                  WebkitTextFillColor: "white",
                  WebkitTextStrokeWidth: 1,
                  WebkitTextStrokeColor: "#d9b45c",
                }}
                className="textStroke text-[28px] absolute flex items-center -top-[2px]  z-0"
              >
                {" "}
                {data?.body?.price -
                  ((100 - data?.body?.sale?.discount_value) / 100) *
                    data?.body?.price}
                جنيه
              </h3>
              <h3 className="text-primary flex items-center relative z-10 text-[28px]">
                {data?.body?.price -
                  ((100 - data?.body?.sale?.discount_value) / 100) *
                    data?.body?.price}
                جنيه
              </h3>
            </div>
            <span className="text-[#523412] text-[24px] inline-block ">
              إذا اشتركت في الباقة كاملة
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default ShowBundle;
