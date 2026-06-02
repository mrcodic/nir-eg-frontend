import { IRoomDetails } from "@/types";
import Image from "next/image";

type Props = {
  data: IRoomDetails;
  lockedToPass: boolean;
};

export default function RoomFloatingCards({ data, lockedToPass }: Props) {
  if (lockedToPass) {
    return <LockedToPassCard />;
  }

  return null;
}

const LockedToPassCard = () => {
  return (
    <div className="border-primary-800 bg-background relative z-10 mx-auto -mt-8 flex w-full max-w-[min(85%,760px)] flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border px-6 py-3 font-bold whitespace-nowrap shadow-md max-md:justify-center md:gap-x-6 md:text-2xl">
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
