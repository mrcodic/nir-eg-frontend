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
        sideOffset={20}
        className={cn(
          "mobile:hidden mt-2 w-full group-data-[template=landing-v3]/template:ms-4 group-data-[template=landing-v3]/template:w-[calc(100vw-32px)] group-data-[template=landing-v3]/template:sm:ms-[7.5vw] group-data-[template=landing-v3]/template:sm:w-[85vw] group-data-[template=landing-v3]/template:md:ms-[calc(10vw+16px)] group-data-[template=landing-v3]/template:md:w-[calc(80vw-32px)]",
          //    {
          //   "ms-4 w-[calc(100vw-32px)] sm:ms-[7.5vw] sm:w-[85vw] md:ms-[calc(10vw+16px)] md:w-[calc(80vw-32px)]":
          //     template == 3,
          // }
        )}
      >
        <div
          className={cn(
            `bg-background group-data-[template=landing-v3]/template:wrapper relative left-0 flex-col p-4 transition-all group-data-[template!=landing-v3]/template:w-screen`,
            // {
            //   wrapper: template == 3,
            //   "w-screen": template != 3,
            // },
          )}
        >
          {(profile?.type === 3
            ? STUDENTSOFFLINELINKS
            : STUDENTSONLINELINKS
          ).map((studentOffline, index) => (
            <Link
              key={index}
              href={studentOffline.href}
              className={`border-gray-light mb-4 flex h-11 items-center justify-center rounded-[10px] border px-3 ${
                pathName.substring(0, 6) === studentOffline.href.substring(0, 6)
                  ? "bg-primary text-white"
                  : "bg-transparent text-[#523412]"
              } `}
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
