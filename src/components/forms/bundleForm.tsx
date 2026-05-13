const BundleForm = async ({ bundleId, data }) => {
  const phoneNumber = "+201008673565";
  const message = `${data?.body?.grade?.title} ${data?.body?.name}  عاوز اشترك في  باقة   `;

  return (
    <div className="mt-[40px] flex w-full flex-col gap-8">
      <div className="flex flex-col items-center gap-[24px] md:flex-row">
        <img
          className="hidden w-full md:block md:w-[156px] md:max-w-1/3"
          src={data?.body?.cover || "/assets/grade-placeholder.png"}
        />
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className={`flex-1 rounded-lg border border-[#1EAD7B] p-4`}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[18px] font-bold text-black">
              {data?.body?.name}
            </h2>
            {!data?.body?.sale?.id && (
              <div className="w-[111px] rounded-lg bg-[#523412] px-[8px] py-[2px] text-center text-[18px] text-white">
                {data?.body?.price} جنيه
              </div>
            )}
            {data?.body?.sale?.id && (
              <div className="flex gap-[24px]">
                <div className="bg-gray-dark rounded-lg px-[8px] py-[2px] font-bold text-white line-through">
                  {data?.body?.price} جنيه
                </div>
                <div className="w-[111px] rounded-lg bg-[#1EAD7B] px-[8px] py-[2px] text-center font-bold text-white">
                  {data?.body?.sale?.discount_type === 0
                    ? ((100 - data?.body?.sale?.discount_value) / 100) *
                      data?.body?.price
                    : data?.body?.price - data?.body?.sale?.discount_value}{" "}
                  جنيه
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-light my-[12px] h-px w-full" />
          <div className="flex gap-[8px] text-base font-bold">
            <span className="text-gray-dark inline-block text-sm">
              {" "}
              {/* {classRoom.description} */}
              {data?.body?.classrooms
                .map((classroom) => classroom.title)
                .join(" و ")}
            </span>
          </div>
          <div className="mt-[24px] flex flex-wrap items-center justify-between">
            <div className="mt-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center gap-2">
                <img className="h-[16px] w-[16px]" src="/assets/create.svg" />
                <span className="text-[10px] text-[#523412]">
                  {new Date(data?.body?.created_at).toISOString().split("T")[0]}
                </span>
              </div>
              {/* <div className="flex gap-2 items-center">
                      <img
                        className="w-[16px] h-[16px]"
                        src={"/assets/update.svg"}
                      />
                      <span className="text-[#523412] text-[10px]">
                        {
                          new Date(data?.body.updated_at)
                            .toISOString()
                            .split("T")[0]
                        }
                      </span>
                    </div> */}
            </div>
            <div className="mt-[20px] flex justify-between">
              {data?.body.sale?.id && (
                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="text-sm font-bold text-black">
                      احصل على خصم
                    </h2>
                    <div className="re flex h-[48px] w-[48px] items-center justify-center bg-[url(/assets/Sale.svg)] bg-cover">
                      <div className="flex items-center justify-center text-center">
                        <span
                          style={{
                            textShadow:
                              "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                          }}
                          className="inline-block text-center text-sm font-bold text-white"
                        >
                          {data?.body.sale?.discount_type === 0
                            ? data?.body.sale?.discount_value + "%"
                            : data?.body.sale?.discount_value + "جنيه"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-gray-dark text-[12px]">
                      متاح لمدة
                    </span>
                    <div className="flex gap-[2px]">
                      <span className="font-bold text-[#B75050] underline">
                        {data?.body?.sale?.duration} أيام
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BundleForm;
