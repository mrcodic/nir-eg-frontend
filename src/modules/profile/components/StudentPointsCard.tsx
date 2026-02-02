"use client";

import Link from "next/link";

function StudentPointsCard({
  points,
  showLink = true,
}: {
  points: number;
  showLink?: boolean;
}) {
  return (
    <div className="border-primary-800 h-[92px] w-full rounded-[12px] border p-2 md:w-fit md:min-w-[260px]">
      <div className="flex h-full items-center gap-4 sm:gap-6">
        <img className="h-8 w-8" src="/assets/star-colored.svg" alt="Star" />

        <div>
          <h3 className="text-[20px] text-[#523412]">النقاط</h3>

          <div className="relative w-fit font-bold text-nowrap">
            {" "}
            <h3
              style={{
                WebkitTextFillColor: "white",
                WebkitTextStrokeWidth: 1,
                WebkitTextStrokeColor: "#d9b45c",
              }}
              className="textStroke absolute -top-0.5 -left-0.5 z-0 flex items-center text-[24px]"
            >
              {points || "--"}
            </h3>
            <h3 className="text-primary relative z-10 flex items-center text-[24px]">
              {points || "--"}
            </h3>
          </div>
        </div>

        {showLink && (
          <Link
            href="#points-table"
            className="bg-primary-800 ms-auto flex h-7 shrink-0 items-center justify-center self-end rounded-md px-3 text-sm font-medium text-white"
          >
            عرض
          </Link>
        )}
      </div>
    </div>
  );
}

export default StudentPointsCard;
