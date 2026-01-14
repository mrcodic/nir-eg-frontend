import RoomPaymentForm from "@/components/forms/RoomPaymentForm";
import PriceBubbles from "@/components/ui/price-bubble";
import PaymentWhatsappLink from "@/modules/payment/components/PaymentWhatsappLink";

const RoomPayment = async ({ roomId, centerId, data }) => {
  return (
    <div className="mt-10 flex w-full flex-col gap-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <img
          className="hidden w-full rounded-lg md:block md:w-[193px] md:max-w-1/3"
          src={data?.body?.room?.cover || "/assets/grade-placeholder.png"}
        />

        <div
          className={`border-gray-light min-h-full grow rounded-lg border p-4`}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[18px] font-bold text-[#121212]">
              {data?.body?.room?.title}
            </h2>

            <PriceBubbles
              price={data?.body?.room?.price}
              sale={data?.body?.room?.sale}
            />
          </div>

          <hr className="border-gray-light my-3 h-px w-full" />

          <p className="flex gap-2 text-[16px] font-bold">
            {data?.body?.room?.description}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[760px]">
        <RoomPaymentForm centerId={centerId} roomId={roomId} />

        <div className="text-primary-800 relative my-10 text-center text-base font-medium">
          <hr className="border-primary-800 absolute inset-x-0 top-1/2 mx-4 -translate-y-1/2 sm:mx-20" />
          <span className="relative z-5 bg-white px-8">او</span>
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
export default RoomPayment;
