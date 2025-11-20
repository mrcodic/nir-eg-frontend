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
import WrapperHOC from "./WrapperHOC";

function MobileDropDown({
  profile,
  STUDENTSONLINELINKS,
  STUDENTSOFFLINELINKS,
}) {
  const pathName = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-10 rounded-lg bg-white  shadow-md  flex justify-center items-center md:hidden px-1">
        <img src="/assets/burgerIcon.svg" className="w-[24px] h-[24px]" />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={20} className="md:hidden">
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
              className={`border px-3 border-primary-700 mb-4 h-[44px] flex items-center justify-center rounded-[10px] ${
                pathName.includes(studentOffline.href)
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
                  className={`border px-3 border-primary-700 h-[44px] flex items-center justify-center rounded-[10px] ${
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
