import Image from "next/image";

export default function RoomProgressCard({
  progress = 0,
}: {
  progress?: number;
}) {
  return (
    <div className="border-primary-800 bg-background flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border px-6 py-3 font-bold whitespace-nowrap shadow-md max-md:justify-center md:gap-x-6 md:py-8 md:text-2xl">
      <Image
        width={48}
        height={48}
        src="/assets/star-colored.svg"
        className="size-12"
        alt="star icon"
      />

      <span className="text-primary-800 inline-block">لقد أنهيت</span>

      <div className="relative">
        {" "}
        <h3 className="textStroke text-32 absolute -top-0.5 -left-0.5 z-0 flex items-center">
          {" "}
          <span>%</span>
          <span>{progress}</span>
        </h3>
        <h3 className="text-primary text-32 relative z-10 flex items-center">
          <span>%</span>
          <span>{progress}</span>
        </h3>
      </div>
      <p className="text-primary-800 inline-block">من محتوى الحصة</p>
    </div>
  );
}
