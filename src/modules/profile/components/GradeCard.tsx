import { mapGradeToText } from "@/utils/clientFun";
import Image from "next/image";

function GradeCard({ grade, text }: { grade: number; text?: string }) {
  const mappedGrade = text || mapGradeToText(grade);

  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
      }}
      className=" w-full  md:w-[246px] flex justify-center gap-2 sm:gap-6 border text-center items-center rounded-[12px] bg-white p-2 border-gray-light"
    >
      <Image
        width={40}
        height={40}
        className="size-8 sm:size-10"
        src="/assets/GradeColor2.svg"
        alt="student grade icon"
      />

      <div className="relative w-full text-nowrap px-1">
        <h3
          style={{
            WebkitTextFillColor: "white",
            WebkitTextStrokeWidth: 1,
            WebkitTextStrokeColor: "#d9b45c",
          }}
          className="textStroke text-base sm:text-xl absolute flex items-center left-1/2 -translate-x-[51%] -top-[2px]  z-0"
        >
          {mappedGrade}
        </h3>
        <h3 className="text-primary flex items-center justify-center relative z-10 text-base sm:text-xl">
          {mappedGrade}
        </h3>
      </div>
    </div>
  );
}

export default GradeCard;
