import { mapGradeToText } from "@/utils/clientFun";
import Image from "next/image";

function GradeCard({ grade, text }: { grade: number; text?: string }) {
  const mappedGrade = text || mapGradeToText(grade);

  return (
    <div className=" w-full   flex justify-center gap-2 sm:gap-4 border text-center items-center rounded-[12px]  p-2 border-secondary">
      <Image
        width={40}
        height={40}
        className="size-8 sm:size-10"
        src="/assets/graduation.svg"
        alt="student grade icon"
      />

      <div className="relative w-full text-nowrap px-1">
        <h3 className="flex font-bold items-center justify-center relative z-10 text-base sm:text-xl">
          {mappedGrade}
        </h3>
      </div>
    </div>
  );
}

export default GradeCard;
