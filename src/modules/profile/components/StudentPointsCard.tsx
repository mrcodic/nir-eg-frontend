"use client";

import Link from "next/link";

function StudentPointsCard({ points }: { points: number }) {
  return (
    <div className="border-primary-800 border h-[92px] rounded-[12px] p-2 w-full md:min-w-[260px] md:w-fit">
      <div className="flex gap-4 sm:gap-6 h-full items-center">
        <img className="w-8 h-8" src="/assets/star-colored.svg" />

        <div>
          <h3 className="text-[20px] text-[#523412]">النقاط</h3>

          <div className="relative  font-bold   text-nowrap w-fit">
            {" "}
            <h3
              style={{
                WebkitTextFillColor: "white",
                WebkitTextStrokeWidth: 1,
                WebkitTextStrokeColor: "#d9b45c",
              }}
              className="textStroke text-[24px] absolute flex items-center -top-0.5 -left-0.5  z-0"
            >
              {points || "--"}
            </h3>
            <h3 className="text-primary flex items-center relative z-10 text-[24px]">
              {points || "--"}
            </h3>
          </div>
        </div>

        <Link
          href="#table"
          className="flex self-end shrink-0 items-center  ms-auto justify-center   bg-primary-800 text-sm font-medium  px-3  h-7 rounded-md text-white"
        >
          عرض
        </Link>
      </div>
    </div>
  );
}

export default StudentPointsCard;
