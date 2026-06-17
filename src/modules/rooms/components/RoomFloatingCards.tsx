import { IRoomDetails } from "@/types";
import Image from "next/image";
import { memo } from "react";
import RoomProgressCard from "./RoomProgressCard";

type Props = {
  data: IRoomDetails;
};

function RoomFloatingCards({ data }: Props) {
  const cardsToRender = [
    {
      card: RoomProgressCard,
      shouldRender:
        data?.is_subscriped &&
        (data?.lock_after == null || Number(data?.lock_after) !== 0),
      props: { progress: data?.room?.progress || 0 },
    },
    {
      card: RoomExpireCard,
      shouldRender:
        data?.is_subscriped &&
        data?.lock_after != null &&
        Number(data?.lock_after) > 0,
      props: { lock_after: data?.lock_after },
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
    <div className="border-primary-800 bg-background flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border px-6 py-3 font-bold whitespace-nowrap shadow-md max-md:justify-center md:gap-x-6">
      <Image
        src="/assets/warning-fill.svg"
        width={28}
        height={28}
        className="size-7"
        alt="warning"
      />
      <p className="text-sm font-bold whitespace-break-spaces">
        يجب أن تنجح في الكويز لتتمكن من عرض محتويات الحصة
      </p>
    </div>
  );
};

const RoomExpireCard = ({ lock_after }: { lock_after?: number }) => {
  if (!lock_after) return null;
  return (
    <div className="border-primary-800 bg-background flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border px-6 py-3 text-sm font-bold whitespace-nowrap shadow-md max-md:justify-center md:gap-x-6">
      <Image
        src="/assets/lock-fill.svg"
        width={28}
        height={28}
        className="size-7"
        alt="warning"
      />
      <p className="whitespace-break-spaces">
        محتويات الحصة متاحة لمدة &nbsp;
        {Math.floor(lock_after / 24) > 0 && (
          <span className="text-primary-800 mr-1 underline underline-offset-4">
            ( {Math.floor(lock_after / 24)}&nbsp;أيام &nbsp;
            {Math.floor(lock_after % 24)} ساعة )
          </span>
        )}
      </p>
    </div>
  );
};

export default memo(RoomFloatingCards);
