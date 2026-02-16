import Image from "next/image";

function ProfileGradeCard({ text }: { text: string }) {
  return (
    <div className="border-secondary flex w-full items-center justify-center gap-2 rounded-[12px] border p-2 text-center sm:gap-4 md:max-w-[246px]">
      <Image
        width={40}
        height={40}
        className="size-8 sm:size-10"
        src="/assets/graduation.webp"
        alt="student grade icon"
      />

      <div className="relative w-full px-1 text-nowrap">
        <h3 className="relative z-10 flex items-center justify-center truncate text-base font-bold md:text-xl">
          {text}
        </h3>
      </div>
    </div>
  );
}

export default ProfileGradeCard;
