function CourseProgressCard({ progress = 0 }: { progress: number }) {
  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
      }}
      className="bg-[#F9FAFC] md:text-2xl whitespace-nowrap
               font-bold mx-auto -mt-8 flex max-md:justify-center flex-wrap md:gap-x-6 gap-x-4 gap-y-1 items-center  max-w-[min(85%,760px)] w-full relative border py-3 md:py-8 px-6 md:px-10 border-[#012D5A] rounded-lg"
    >
      <img src="../assets/Star.svg" className="w-[48px] h-[48px]" />

      <span className=" text-[#523412] inline-block">لقد أنهيت</span>
      <div className="relative   ">
        {" "}
        <h3 className="textStroke text-[32px] absolute flex items-center  -top-0.5 -left-0.5  z-0">
          {" "}
          <span>%</span>
          <span>{progress}</span>
        </h3>
        <h3 className="text-primary flex items-center relative   z-10 text-[32px]">
          <span>%</span>
          <span>{progress}</span>
        </h3>
      </div>
      <p className="text-[#523412] inline-block">من الكورس</p>
    </div>
  );
}

export default CourseProgressCard;
