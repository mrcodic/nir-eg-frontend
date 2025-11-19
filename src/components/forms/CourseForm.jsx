import { mapGradeToText } from "@/utils/clientFun";
import Empty from "../Empty";

const CourseForm = async ({ courseId, data }) => {
  if (!data)
    return (
      <div className="h-screen">
        <Empty text={"no data"} />
      </div>
    );

  const phoneNumber = "+201008673565";
  const message = `عاوز اشترك في كورس ${data?.title} ${mapGradeToText(
    data?.grade.id
  )}`;

  console.log(data);

  return (
    <div className="mt-[40px] w-full">
      <div className="flex flex-col items-center md:flex-row gap-[24px]">
        <img
          className="md:w-[156px] md:max-w-1/3 w-full hidden md:block  "
          src={data?.thumbnail || "/assets/grade-placeholder.png"}
        />
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className={`flex-1 border border-[#1EAD7B] rounded-[8px] p-4 `}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[#121212] text-[18px] font-bold">
              {data?.title}
            </h2>
            {!data?.sale?.id && data?.price && (
              <div className="bg-[#523412] text-center w-[111px] py-[2px] px-[8px] text-[18px] rounded-[8px] text-white">
                {data?.price} جنيه
              </div>
            )}
            {data?.sale?.id && (
              <div className="flex gap-[24px]">
                <div className="bg-[#454545] font-bold text-white py-[2px] px-[8px] line-through rounded-[8px]">
                  {data?.price} جنيه
                </div>
                <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-[8px]">
                  {data?.sale?.discount_type === 0
                    ? ((100 - data?.sale?.discount_value) / 100) * data?.price
                    : data?.price - data?.sale?.discount_value}{" "}
                  جنيه
                </div>
              </div>
            )}
          </div>
          <div className="h-px w-full bg-primary-700 my-[12px]" />
          <div className="flex font-bold text-[16px]  gap-[8px]">
            <span className="text-[#454545] inline-block text-sm">
              {" "}
              {data?.description}
            </span>
          </div>
          <div className="flex flex-wrap mt-[24px] justify-between items-center">
            <div className="mt-[16px] flex-col flex gap-[10px]">
              <div className="flex gap-2 items-center">
                <img className="w-[16px] h-[16px]" src="/assets/create.svg" />
                <span className="text-[#523412] text-[10px]">
                  {data?.created_at.split(" ")?.[0]}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <img className="w-[16px] h-[16px]" src={"/assets/Update.svg"} />
                <span className="text-[#523412] text-[10px]">
                  {data?.updated_at.split(" ")?.[0]}{" "}
                </span>
              </div>
            </div>
            {data?.sale && (
              <div>
                <div className="flex gap-1 items-center">
                  <h2 className="text-[#121212]  text-[14px] font-bold">
                    احصل على خصم
                  </h2>
                  <div className="bg-[url(/assets/sale?.svg)]  mr-2 flex items-center justify-center w-[32px] h-[32px]">
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
                            {data?.sale?.discount_type === 0
                              ? data?.sale?.discount_value + "%"
                              : data?.sale?.discount_value + "جنيه"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[12px] text-[#454545]">متاح لمدة</span>
                  <span className="text-[#B75050] font-bold underline">
                    {data?.sale?.duration}
                    أيام
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseForm;
