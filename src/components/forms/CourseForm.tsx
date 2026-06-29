import Empty from "../Empty";

const CourseForm = async ({ courseId, data }) => {
  if (!data)
    return (
      <div className="h-screen">
        <Empty text={"no data"} />
      </div>
    );

  const phoneNumber = "+201008673565";
  const message = `عاوز اشترك في كورس ${data?.title} ${data?.grade?.name}`;

  console.log(data);

  return (
    <div className="mt-[40px] w-full">
      <div className="flex flex-col items-center gap-[24px] md:flex-row">
        <img
          className="hidden w-full md:block md:w-[156px] md:max-w-1/3"
          src={data?.thumbnail || "/assets/grade-placeholder.png"}
        />
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className={`flex-1 rounded-lg border border-[#1EAD7B] p-4`}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-lg font-bold text-black">{data?.title}</h2>
            {!data?.sale?.id && data?.price && (
              <div className="w-[111px] rounded-lg bg-[#523412] px-[8px] py-[2px] text-center text-lg text-white">
                {data?.price} جنيه
              </div>
            )}
            {data?.sale?.id && (
              <div className="flex gap-[24px]">
                <div className="bg-gray-dark rounded-lg px-[8px] py-[2px] font-bold text-white line-through">
                  {data?.price} جنيه
                </div>
                <div className="w-[111px] rounded-lg bg-[#1EAD7B] px-[8px] py-[2px] text-center font-bold text-white">
                  {data?.sale?.discount_type === 0
                    ? ((100 - data?.sale?.discount_value) / 100) * data?.price
                    : data?.price - data?.sale?.discount_value}{" "}
                  جنيه
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-light my-[12px] h-px w-full" />
          <div className="flex gap-[8px] text-base font-bold">
            <span className="text-gray-dark inline-block text-sm">
              {" "}
              {data?.description}
            </span>
          </div>
          <div className="mt-[24px] flex flex-wrap items-center justify-between">
            <div className="mt-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-2">
                <img className="h-[16px] w-[16px]" src="/assets/create.svg" />
                <span className="text-[10px] text-[#523412]">
                  {data?.created_at.split(" ")?.[0]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img className="h-[16px] w-[16px]" src={"/assets/Update.svg"} />
                <span className="text-[10px] text-[#523412]">
                  {data?.updated_at.split(" ")?.[0]}{" "}
                </span>
              </div>
            </div>
            {data?.sale && (
              <div>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold text-black">احصل على خصم</h2>
                  <div className="mr-2 flex h-[32px] w-[32px] items-center justify-center bg-[url(/assets/sale?.svg)]">
                    <div className="flex items-center justify-center text-center">
                      <div className="re flex h-[48px] w-[48px] items-center justify-center bg-[url(/assets/Sale.svg)] bg-cover">
                        <div className="flex items-center justify-center text-center">
                          <span
                            style={{
                              textShadow:
                                "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                            }}
                            className="mt-[2px] inline-block text-center text-sm text-white"
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-dark text-xs">متاح لمدة</span>
                  <span className="font-bold text-[#B75050] underline">
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
