import Image from "next/image";

function RoomProgressBadge({ progress = 0 }: { progress: number }) {
  return (
    <div className="bg-background flex flex-wrap items-center justify-center gap-2 rounded-lg px-2 py-1 font-bold">
      <Image
        width={16}
        height={16}
        className="h-4 w-4"
        src="/assets/launch.svg"
        alt=""
      />
      <p className="text-sm">
        أنهيت{" "}
        <span className="text-primary-800 font-bold underline">
          {progress}%
        </span>{" "}
        من الحصة
      </p>
    </div>
  );
}

export default RoomProgressBadge;
