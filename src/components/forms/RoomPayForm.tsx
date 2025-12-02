import PaymentRoomForm from "@/components/forms/PaymentRoom";
import PaymentWhatsappLink from "@/modules/payment/components/PaymentWhatsappLink";
import PriceBubbles from "../ui/price-bubble";

const RoomPayForm = async ({ roomId, centerId, data }) => {
  return (
    <div className="mt-10 flex flex-col gap-8 w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          className="md:w-[193px] md:max-w-1/3 w-full hidden md:block  rounded-lg"
          src={data?.body?.room?.cover || "/assets/grade-placeholder.png"}
        />

        <div
          className={`grow border border-gray-light rounded-lg p-4 min-h-full`}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[#121212] text-[18px] font-bold">
              {data?.body?.room?.title}
            </h2>

            <PriceBubbles
              price={data?.body?.room?.price}
              sale={data?.body?.room?.sale}
            />
          </div>

          <hr className="h-px w-full border-gray-light my-3" />

          <p className="flex font-bold text-[16px]  gap-2">
            {data?.body?.room?.description}
          </p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto w-full">
        <PaymentRoomForm centerId={centerId} roomId={roomId} />

        <div className="relative text-center my-10 text-primary-800  text-base font-medium">
          <hr className="border-primary-800 absolute top-1/2 inset-x-0 -translate-y-1/2 mx-4 sm:mx-20" />
          <span className="px-8 bg-background relative z-5">او</span>
        </div>

        <div>
          <h4 className="text-xl font-bold">
            لو مش معاك كود الدفع، كلمنا على واتساب
          </h4>

          <PaymentWhatsappLink className="mt-4" />
        </div>
      </div>
    </div>
  );
};
export default RoomPayForm;
