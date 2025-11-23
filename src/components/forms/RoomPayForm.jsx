import PaymentRoomForm from "@/components/forms/PaymentRoom";

const RoomPayForm = async ({ roomId, centerId, data }) => {
  const phoneNumber = "+201008673565";
  const message = `${data?.body?.room?.grade?.title} ${data?.body?.room?.name}  عاوز اشترك في  باقة   `;

  return (
    <div className="mt-[40px] flex flex-col gap-8 w-full">
      <div className="flex flex-col  items-center md:flex-row gap-[24px]">
        <img
          className="md:w-[156px] md:max-w-1/3 w-full hidden md:block  "
          src={data?.body?.room?.cover || "/assets/grade-placeholder.png"}
        />
        <div
          style={{
            boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
          }}
          className={`flex-1 border border-[#1EAD7B] rounded-lg p-4 `}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[#121212] text-[18px] font-bold">
              {data?.body?.room?.title}
            </h2>
            {!data?.body?.room?.sale?.id &&
              data?.body?.subscription_type !== "حصة" && (
                <div className="bg-[#523412] text-center w-[111px] py-[2px] px-[8px] text-[18px] rounded-lg text-white">
                  {data?.body?.room?.price} جنيه
                </div>
              )}
            {data?.body?.room?.sale?.id && (
              <div className="flex gap-[24px]">
                <div className="bg-gray-dark font-bold text-white py-[2px] px-[8px] line-through rounded-lg">
                  {data?.body?.room?.price} جنيه
                </div>
                <div className="bg-[#1EAD7B] w-[111px] text-center font-bold text-white py-[2px] px-[8px]  rounded-lg">
                  {data?.body?.room?.sale?.discount_type === 0
                    ? ((100 - data?.body?.room?.sale?.discount_value) / 100) *
                      data?.body?.room?.price
                    : data?.body?.room?.price -
                      data?.body?.room?.sale?.discount_value}{" "}
                  جنيه
                </div>
              </div>
            )}
          </div>
          <div className="h-px w-full bg-gray-light my-[12px]" />
          <div className="flex font-bold text-[16px]  gap-[8px]">
            {data?.body?.room?.description}
          </div>
          <div className="flex flex-wrap mt-[24px] justify-between items-center">
            {/* <div className="mt-[16px] flex-col flex gap-[10px]">
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-[16px] h-[16px]"
                        src="/assets/create.svg"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-[16px] h-[16px]"
                        src={"/assets/update.svg"}
                      />
                      <span className="text-[#523412] text-[10px]">
                        {data?.body?.room?.updated_at}{" "}
                      </span>
                    </div>
                  </div> */}
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
                        {data?.body?.room?.sale?.duration} أيام
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
        }}
        className="mt-[56px] rounded-lg border py-[32px] px-10 md:px-[40px] border-primary"
      >
        {" "}
        {/* <div className="flex flex-col">
                <h2 className="text-[#523412] text-sm">الكود</h2>
                <div className="flex w-full gap-[24px]">
                  <div className="bg-white flex-1  border-[#523412] border-b p-2 mt-[4px]">
                    <input
                      type="text"
                      className="mt-[8px] text-[#121212] font-medium text-sm border-none focus:outline-hidden placeholder:text-[#121212]"
                      placeholder="أدخل الكود"
                    />
                  </div>
                  <button className="bg-primary rounded-[10px] self-end border border-gray-light px-[24px] text-white h-[40px]">
                    إدخال
                  </button>
                </div>
              </div> */}
        <PaymentRoomForm
          centerId={centerId}
          roomId={roomId}
          id={data?.body?.room?.id}
        />
      </div>
      <h3 className="mt-[16px] text-[18px]">
        أدخل الكود لتتمكن من عرض محتوى الحصة , للحصول علي الكود من خلال السنتر.
      </h3>
      {/* <div className="my-[48px] flex items-center justify-center   w-full gap-4">
        <div className="bg-gray-light h-px w-full" />
        <span className="text-[#523412] text-[16px]">أو</span>
        <div className="bg-gray-light h-px w-full" />
      </div> */}
      {/* <div className="flex flex-wrap gap-[24px] items-center">
        <img className="w-[144px]" src="/assets/Vodafone-cash.svg" />
        <p className="text-[#121212] text-[20px] font-bold">
          <ul className="flex flex-col gap-4">
            <li>للحصول على كود : من خلال السنتر</li>
            {/* <li>
              ١- حول تمن الباقه فودافون كاش للرقم ده 01092890031 او للرقم ده
              01093614229
            </li>

            <li>٢- احتفظ ب screenshot التحويل</li>

            <li>
              ٣-{" "}
              <a
                href={`https://wa.me/${phoneNumber}?text=${message}`}
                target="_blank"
                className="underline"
              >
                <span>تواصل معنا واتساب</span>
              </a>{" "}
              و ابعت السكرين شوت هيتم ارسال الكود ليك خلال ٤ ساعات ( اوقات العمل
              من ١٠ صباحا الي ١ ليلا)
            </li> 
          </ul>
        </p>
      </div> 
       <div className="mt-[24px] items-center flex gap-[24px]">
        <img className="w-[32px] h-[32px]" src="/assets/Whatsapp.svg" />
        <span className="text-[18px] font-bold">
          تواصل معنا عبر تطبيق واتساب
        </span>
      </div>
      <div className="w-full mx-auto flex items-center justify-center ">
        <WhatsAppContact phoneNumber={phoneNumber} message={message} />
      </div> */}
    </div>
  );
};
export default RoomPayForm;
