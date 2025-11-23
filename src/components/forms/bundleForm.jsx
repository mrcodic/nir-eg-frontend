const BundleForm = async ({ bundleId, data }) => {
  const phoneNumber = "+201008673565";
  const message = `${data?.body?.grade?.title} ${data?.body?.name}  عاوز اشترك في  باقة   `;
  return (
    <div className="mt-[40px] flex flex-col gap-8 w-full">
      <div className="flex flex-col  items-center md:flex-row gap-[24px]">
        <img
          className="md:w-[156px] md:max-w-1/3 w-full hidden md:block  "
          src={data?.body?.cover || "/assets/grade-placeholder.png"}
        />
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className={`flex-1 border border-[#1EAD7B] rounded-lg p-4 `}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[#121212] text-[18px] font-bold">
              {data?.body?.name}
            </h2>
            {!data?.body?.sale?.id && (
              <div className="bg-[#523412] text-center w-[111px] py-[2px] px-[8px] text-[18px] rounded-lg text-white">
                {data?.body?.price} جنيه
              </div>
            )}
            {data?.body?.sale?.id && (
              <div className="flex gap-[24px]">
                <div className="bg-gray-dark font-bold text-white py-[2px] px-[8px] line-through rounded-lg">
                  {data?.body?.price} جنيه
                </div>
                <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-lg">
                  {data?.body?.sale?.discount_type === 0
                    ? ((100 - data?.body?.sale?.discount_value) / 100) *
                      data?.body?.price
                    : data?.body?.price - data?.body?.sale?.discount_value}{" "}
                  جنيه
                </div>
              </div>
            )}
          </div>
          <div className="h-px w-full bg-gray-light my-[12px]" />
          <div className="flex font-bold text-[16px]  gap-[8px]">
            <span className="text-gray-dark inline-block text-sm">
              {" "}
              {/* {classRoom.description} */}
              {data?.body?.classrooms
                .map((classroom) => classroom.title)
                .join(" و ")}
            </span>
          </div>
          <div className="flex flex-wrap mt-[24px] justify-between items-center">
            <div className="mt-[16px] flex-col flex gap-[10px]">
              <div className="flex gap-2 items-center">
                <img className="w-[16px] h-[16px]" src="/assets/create.svg" />
                <span className="text-[#523412] text-[10px]">
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
            <div className="flex mt-[20px] justify-between">
              {data?.body.sale?.id && (
                <div>
                  <div className="flex gap-1 items-center">
                    <h2 className="text-[#121212] text-sm font-bold">
                      احصل على خصم
                    </h2>
                    <div className="bg-[url(/assets/Sale.svg)] re bg-cover flex items-center justify-center w-[48px] h-[48px]">
                      <div className="text-center flex items-center justify-center">
                        <span
                          style={{
                            textShadow:
                              "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                          }}
                          className=" inline-block font-bold text-white text-center text-sm"
                        >
                          {data?.body.sale?.discount_type === 0
                            ? data?.body.sale?.discount_value + "%"
                            : data?.body.sale?.discount_value + "جنيه"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex text-[12px] gap-2 items-center">
                    <span className="text-[12px] text-gray-dark">
                      متاح لمدة
                    </span>
                    <div className="flex gap-[2px]">
                      <span className="text-[#B75050] font-bold underline">
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
