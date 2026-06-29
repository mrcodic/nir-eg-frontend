import { cn } from "@/lib/utils";
import ProfileGradeCard from "@/modules/profile/components/ProfileGradeCard";
import { IPortalSummaryData } from "../types";

function PortalHeader({
  student,
  templateType,
}: {
  student: IPortalSummaryData["student"];
  templateType: string;
}) {
  return (
    <div className="rounded-lg bg-[#FBF6F0] p-6">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">مرحبًا بك!</p>
        <p className="text-lg font-bold text-[#454545]">ولي أمر الطالب/</p>
      </div>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-b border-[#D9B45C] pb-6">
        <div className="flex flex-wrap items-center gap-[24px]">
          <img
            className="h-[48px] w-[48px] rounded-full"
            src={student?.avatar || "/assets/avatar-user.svg"}
            onError={(e) => {
              e.currentTarget.src = "/assets/avatar-user.svg";
            }}
          />
          <h3 className="text-lg font-bold text-[#523412] md:text-[24px]">
            {student?.name || "--"}
          </h3>
        </div>

        <ProfileGradeCard text={student?.grade_name} />
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg bg-[#1EAD7B] px-4 py-2",
            {
              "bg-[#F49309]": templateType === "offline",
            },
          )}
        >
          <span className="text-lg font-bold text-white">
            طالب {templateType === "online" ? "اونلاين" : "اوفلاين"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PortalHeader;
