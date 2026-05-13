import CodePaymentForm from "@/components/forms/CodePaymentForm";
import CustomImage from "@/components/ui/CustomImage";
import PriceBubbles from "@/components/ui/price-bubble";

const RoomPayment = async ({ roomId, courseId, data }) => {
  return (
    <div className="mt-10 flex w-full flex-col gap-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <CustomImage
          className="hidden w-full rounded-lg md:block md:w-[193px] md:max-w-1/3"
          src={data?.body?.room?.cover || "/assets/grade-placeholder.png"}
          width={193}
          height={193}
          fallback="/assets/grade-placeholder.png"
          alt=""
        />

        <div
          className={`border-gray-light min-h-full grow rounded-lg border p-4`}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-[18px] font-bold text-black">
              {data?.body?.room?.title}
            </h2>

            <PriceBubbles
              price={data?.body?.room?.price}
              sale={data?.body?.room?.sale}
            />
          </div>

          <hr className="border-gray-light my-3 h-px w-full" />

          <p className="flex gap-2 text-base font-bold">
            {data?.body?.room?.description}
          </p>
        </div>
      </div>

      <CodePaymentForm courseId={courseId} roomId={roomId} />
    </div>
  );
};
export default RoomPayment;
