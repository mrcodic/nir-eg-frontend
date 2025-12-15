"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentTemplate } from "@/helpers/sass";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";

function MobileDropDown({
  profile,
  STUDENTSONLINELINKS,
  STUDENTSOFFLINELINKS,
}) {
  const pathName = usePathname();
  const template = getCurrentTemplate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-10 rounded-lg bg-white  shadow-md  flex justify-center items-center mobile:hidden px-1">
        <MenuIcon size={24} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={20}
        className={cn("mobile:hidden w-full mt-2", {
          "w-[calc(100vw-32px)] sm:w-[85vw]  md:w-[calc(80vw-32px)] ms-4 sm:ms-[7.5vw] md:ms-[calc(10vw+16px)]":
            template == 3,
        })}
      >
        <div
          className={cn(
            `relative  left-0  flex-col   bg-background p-4 transition-all    `,
            {
              wrapper: template == 3,
              "w-screen": template != 3,
            }
          )}
        >
          {(profile?.type === 3
            ? STUDENTSOFFLINELINKS
            : STUDENTSONLINELINKS
          ).map((studentOffline, index) => (
            <Link
              key={index}
              href={studentOffline.href}
              className={`border px-3 border-gray-light mb-4 h-[44px] flex items-center justify-center rounded-[10px] ${
                pathName.substring(0, 6) === studentOffline.href.substring(0, 6)
                  ? "bg-primary text-white"
                  : "bg-transparent text-[#523412]"
              }   `}
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
