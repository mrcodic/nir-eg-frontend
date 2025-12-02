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
import { BookLinksSettings } from "@/types/books.types";
import { MenuIcon } from "lucide-react";
import WrapperHOC from "./WrapperHOC";

function MobileDropDown({
  profile,
  STUDENTSONLINELINKS,
  STUDENTSOFFLINELINKS,
}) {
  const pathName = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-10 rounded-lg bg-white  shadow-md  flex justify-center items-center mobile:hidden px-1">
        <MenuIcon size={24} />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={20} className="mobile:hidden">
        <div
          className={cn(
            `relative  left-0  flex-col  w-screen bg-background p-4 transition-all    `
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

          <WrapperHOC queryKey={["settings/books"]}>
            {({ data }: { data: { data: BookLinksSettings } }) => {
              const booksData = data?.data;
              if (!booksData?.links?.length) return null;

              return (
                <Link
                  href="/books"
                  className={`border px-3 border-gray-light h-[44px] flex items-center justify-center rounded-[10px] ${
                    pathName === "/books"
                      ? "bg-primary text-white"
                      : "bg-transparent text-[#523412]"
                  }   `}
                >
                  كتب
                </Link>
              );
            }}
          </WrapperHOC>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MobileDropDown;
