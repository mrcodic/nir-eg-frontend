"use client";

import { TopStudent } from "@/types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const placeholderAvatars = [
  "/assets/avatar-1.svg",
  "/assets/avatar-2.svg",
  "/assets/avatar-3.svg",
];

function TopCourseStudentsBadges({ students }: { students: TopStudent[] }) {
  if (!students) return null;

  return (
    <TooltipProvider>
      <div className="data-[slot=avatar]:*:ring-background flex flex-row-reverse [&>div]:-ms-1.5 data-[slot=avatar]:*:size-10 data-[slot=avatar]:*:ring-2 data-[slot=avatar]:*:grayscale justify-start my-1">
        {students?.slice(0, 3)?.map((student, index) => (
          <Tooltip key={student.student_id}>
            <TooltipTrigger asChild>
              <div className="relative group/avatar">
                <Avatar className="size-8 transition-all hover:z-10 group-hover/avatar:scale-110 group-hover/avatar:grayscale-0 border-2 border-[#F8DEC5]">
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
                  className="absolute -top-2.5 left-0 -rotate-12 group-hover/avatar:scale-110 group-hover/avatar:-translate-y-1 transition-all z-10 "
                />
                {/* student rank number */}
                <p className="absolute font-bold -bottom-1 left-1/2 -translate-x-1/2 bg-[#F8DEC5] size-3 text-[10px] flex items-center justify-center rounded-full  transition-all z-10 border border-gray-400">
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
