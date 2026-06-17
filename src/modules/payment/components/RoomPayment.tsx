import DataLabel from "@/components/custom/DataLabel";
import CodePaymentForm from "@/components/forms/CodePaymentForm";
import CustomImage from "@/components/ui/CustomImage";
import PriceBubbles from "@/components/ui/price-bubble";
import { cn } from "@/lib/utils";
import { IRoomDetails } from "@/types";

const RoomPayment = async ({
  roomId,
  courseId,
  data,
}: {
  roomId: string;
  courseId: string;
  data: IRoomDetails;
}) => {
  return (
    <div className="mt-10 flex w-full flex-col">
      <div className="flex flex-col gap-6 md:flex-row">
        <CustomImage
          className="hidden w-full rounded-lg md:block md:w-[193px] md:max-w-1/3"
          src={data?.room?.thumbnail || "/assets/grade-placeholder.png"}
          width={193}
          height={193}
          fallback="/assets/grade-placeholder.png"
          alt=""
        />

        <div
          className={`border-gray-light flex min-h-full grow flex-col rounded-lg border p-4`}
        >
          <div className="flex w-full justify-between gap-[24px]">
            <h2 className="text-lg font-bold text-black">
              {data?.room?.title}
            </h2>

            <PriceBubbles price={data?.room?.price} />
          </div>

          <hr className="border-gray-light my-3 h-px w-full" />

          <p
            className={cn("flex gap-2 text-base font-bold", {
              "mb-4": data?.room?.created_at,
            })}
          >
            {data?.room?.description}
          </p>

          {data?.room?.created_at && (
            <div className="mt-auto flex items-center gap-2">
              <img className="size-6" src="/assets/calendar.svg" />

              <DataLabel
                value={data?.room?.created_at?.split(" ")?.[0]}
                text="تاريخ الاضافة"
                textClassName="text-xs text-black"
              />
            </div>
          )}
        </div>
      </div>

      <CodePaymentForm courseId={courseId} roomId={roomId} />
    </div>
  );
};
export default RoomPayment;
