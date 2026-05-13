"use client";

import { TopStudent } from "@/types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const placeholderAvatars = [
  "/assets/avatar-1.svg",
  "/assets/avatar-2.svg",
  "/assets/avatar-3.svg",
];

function TopCourseStudentsBadges({ students }: { students: TopStudent[] }) {
  if (!students) return null;

  return (
    <TooltipProvider>
      <div className="data-[slot=avatar]:*:ring-background my-1 flex flex-row-reverse justify-start data-[slot=avatar]:*:size-10 data-[slot=avatar]:*:ring-2 data-[slot=avatar]:*:grayscale [&>div]:-ms-1.5">
        {students?.slice(0, 3)?.map((student, index) => (
          <Tooltip key={student.student_id}>
            <TooltipTrigger asChild>
              <div className="group/avatar relative">
                <Avatar className="border-primary size-8 border-2 transition-all group-hover/avatar:scale-110 group-hover/avatar:grayscale-0 hover:z-10">
                  <AvatarImage
                    src={
                      student.profile_image?.includes("images/default")
                        ? placeholderAvatars[index]
                        : student.profile_image
                    }
                    alt={student.first_name + " " + student.last_name}
                    onError={(e) =>
                      (e.currentTarget.src = placeholderAvatars[index])
                    }
                  />
                  <AvatarFallback>
                    {student.first_name[0] + student.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                {/* student crown */}
                <Image
                  src="/assets/Crown.svg"
                  width={20}
                  height={20}
                  alt="leaderboard cup"
                  className="absolute -top-2.5 left-0 z-10 -rotate-12 transition-all group-hover/avatar:-translate-y-1 group-hover/avatar:scale-110"
                />
                {/* student rank number */}
                <p className="absolute -bottom-1 left-1/2 z-10 flex size-3 -translate-x-1/2 items-center justify-center rounded-full border border-gray-400 bg-[#F8DEC5] text-[10px] font-bold transition-all">
                  {index + 1}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black text-white">
              <p>{student.first_name + " " + student.last_name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

export default TopCourseStudentsBadges;
