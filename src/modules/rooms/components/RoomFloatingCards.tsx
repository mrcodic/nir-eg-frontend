import { IRoomDetails } from "@/types";
import Image from "next/image";
import RoomProgressCard from "./RoomProgressCard";

type Props = {
  data: IRoomDetails;
};

export default function RoomFloatingCards({ data }: Props) {
  const cardsToRender = [
    {
      card: RoomProgressCard,
      shouldRender:
        data?.is_subscriped &&
        (data?.room?.lock_after == null ||
          Number(data?.room?.lock_after) !== 0),
      props: { progress: data?.room?.progress || 0 },
    },
    {
      card: LockedToPassCard,
      shouldRender: data?.locked_to_pass,
    },
  ];

  return (
    <div className="relative z-10 mx-auto -mt-8 flex w-full max-w-[min(85%,760px)] flex-col items-center gap-2 empty:hidden">
      {cardsToRender
        .filter((card) => card.shouldRender)
        .map((card, idx) => {
          const CardComponent = card.card;
          return <CardComponent key={idx} {...card.props} />;
        })}
    </div>
  );
}

const LockedToPassCard = () => {
  return (
    <div className="border-primary-800 bg-background flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border px-6 py-3 font-bold whitespace-nowrap shadow-md max-md:justify-center md:gap-x-6 md:text-2xl">
      <Image
        src="/assets/warning-fill.svg"
        width={28}
        height={28}
        className="size-7"
        alt="warning"
      />
      <p className="text-sm font-bold">
        يجب أن تنجح في الكويز لتتمكن من عرض محتويات الحصة
      </p>
    </div>
  );
};
