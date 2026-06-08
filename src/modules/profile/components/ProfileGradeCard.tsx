import Image from "next/image";

function ProfileGradeCard({ text }: { text: string }) {
  return (
    <div className="border-primary-800 flex w-full items-center justify-center gap-2 rounded-[12px] border p-2 text-center sm:gap-4">
      <Image
        width={40}
        height={40}
        className="size-8 sm:size-10"
        src="/assets/graduation.webp"
        alt="student grade icon"
      />

      <h3 className="relative z-10 line-clamp-1 flex items-center justify-center text-base font-bold md:text-xl">
        {text}
      </h3>
    </div>
  );
}

export default ProfileGradeCard;
