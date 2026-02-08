"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";

function MobileDropDown({
  profile,
  STUDENTSONLINELINKS,
  STUDENTSOFFLINELINKS,
}) {
  const pathName = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mobile:hidden flex size-10 items-center justify-center rounded-lg bg-white px-1 shadow-md">
        <MenuIcon size={24} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={18}
        className={cn(
          "mobile:hidden bg-background border-transparent px-0 group-data-[template=landing-v3]/template:bg-transparent group-data-[template=landing-v3]/template:px-4 sm:group-data-[template=landing-v3]/template:px-5",
          "border-b-gray-light border-b",
          //    {
          //   "ms-4 w-[calc(100vw-32px)] sm:ms-[7.5vw] sm:w-[85vw] md:ms-[calc(10vw+16px)] md:w-[calc(80vw-32px)]":
          //     template == 3,
          // }
        )}
      >
        <div
          className={cn(
            `wrapper bg-background relative left-0 flex-col p-4 transition-all group-data-[template!=landing-v3]/template:w-screen group-data-[template=landing-v3]/template:mt-2 group-data-[template=landing-v3]/template:rounded-lg`,
            // {
            //   wrapper: template == 3,
            //   "w-screen": template != 3,
            // },
          )}
        >
          {(profile?.type === 3
            ? STUDENTSOFFLINELINKS
            : STUDENTSONLINELINKS
          ).map((studentOffline, index, arr) => (
            <Link
              key={index}
              href={studentOffline.href}
              className={`border-gray-light flex h-11 items-center justify-center rounded-[10px] border px-3 ${
                pathName.substring(0, 6) === studentOffline.href.substring(0, 6)
                  ? "bg-primary text-white"
                  : "bg-transparent text-[#523412]"
              } ${index < arr.length - 1 ? "mb-4" : ""} `}
            >
              <DropdownMenuItem>{studentOffline.title}</DropdownMenuItem>
            </Link>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MobileDropDown;
