"use client";

import RoomHeader from "@/components/RoomHeader";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ExamsPointsChart from "./ExamsPointsChart";

function StudentTasksOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["/students/exams/overview"],
    queryFn: getClientPrivateData,
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

      <div className="grid grid-cols-12 gap-x-4 gap-y-8">
        <div className="col-span-12 mt-8 flex flex-col gap-x-12 lg:col-span-4">
          <div className="border-gray-light flex flex-col gap-4 border-b py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/ExamsColor.svg"
                width={32}
                height={32}
                alt=""
              />
              <h4 className="text-lg font-bold">عدد الامتحانات الكلية</h4>
            </div>
            <div className="flex items-center gap-2 ps-12 text-lg font-bold">
              <span className="text-28">{counts?.total}</span>
              <span>امتحان</span>
            </div>
          </div>

          <div className="border-gray-light flex flex-col gap-4 border-b py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/CorrectColor.svg"
                width={32}
                height={32}
                alt=""
              />
              <h4 className="text-lg font-bold text-[#1EAD7B]">ناجح</h4>
            </div>
            <div className="flex items-center gap-2 ps-12 text-lg font-bold">
              <span className="text-28 text-[#1EAD7B]">{counts?.passed}</span>
              <span>امتحان</span>
            </div>
          </div>

          <div className="border-gray-light flex flex-col gap-4 border-b py-4">
            <div className="flex items-center gap-4">
              <Image src="/assets/Close2.svg" width={32} height={32} alt="" />
              <h4 className="text-lg font-bold text-[#B75050]">راسب</h4>
            </div>
            <div className="flex items-center gap-2 ps-12 text-lg font-bold">
              <span className="text-28 text-[#B75050]">{counts?.failed}</span>
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
