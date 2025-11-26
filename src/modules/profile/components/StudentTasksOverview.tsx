"use client";

import RoomHeader from "@/components/RoomHeader";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ExamsPointsChart from "./ExamsPointsChart";

function StudentTasksOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["/students/exams/overview"],
    queryFn: getDataClient,
  });

  // if (isLoading || !data || !data?.body) return null;

  console.log("exam overview ", data);

  if (isLoading) return null;

  const {
    body: { counts, exams },
  } = data || {
    body: { counts: { total: 0, passed: 0, failed: 0 }, exams: [] },
  };

  return (
    <div className="mt-24">
      <RoomHeader icon={"/assets/ExamsColor.svg"} title={"الدرجات"} />

      <div className="grid grid-cols-12 gap-y-8 gap-x-4">
        <div className="lg:col-span-4 col-span-12 flex flex-col  mt-8 gap-x-12   ">
          <div className="flex flex-col gap-4 py-4 border-b border-gray-light">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/ExamsColor.svg"
                width={32}
                height={32}
                alt=""
              />
              <h4 className="text-lg font-bold">عدد الامتحانات الكلية</h4>
            </div>
            <div className="text-lg font-bold flex items-center gap-2 ps-12">
              <span className="text-28 ">{counts?.total}</span>
              <span>امتحان</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 py-4 border-b border-gray-light">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/CorrectColor.svg"
                width={32}
                height={32}
                alt=""
              />
              <h4 className="text-lg font-bold text-[#1EAD7B]">ناجح</h4>
            </div>
            <div className="text-lg font-bold flex items-center gap-2 ps-12">
              <span className="text-28 text-[#1EAD7B]">{counts?.passed}</span>
              <span>امتحان</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 py-4 border-b border-gray-light">
            <div className="flex items-center gap-4">
              <Image src="/assets/Close2.svg" width={32} height={32} alt="" />
              <h4 className="text-lg font-bold text-[#B75050]">راسب</h4>
            </div>
            <div className="text-lg font-bold flex items-center gap-2 ps-12">
              <span className="text-28 text-[#B75050] ">{counts?.failed}</span>
              <span>امتحان</span>
            </div>
          </div>
        </div>

        <ExamsPointsChart exams={exams || []} />
      </div>
    </div>
  );
}

export default StudentTasksOverview;
