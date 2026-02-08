"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function GuestDropdown() {
  const pathName = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mobile:hidden flex size-10 items-center justify-center rounded-lg bg-white px-1 shadow-md">
        <MenuIcon size={24} />
      </DropdownMenuTrigger>

      {/* w-[calc(100vw-32px)] sm:ms-[7.5vw] sm:w-[85vw] md:ms-[calc(10vw+16px)] md:w-[calc(80vw-32px)] */}
      <DropdownMenuContent
        sideOffset={18}
        // className={cn(
        //   "mobile:hidden bg-primary-50 group-data-[template=landing-v3]/template:wrapper border-none p-2 px-0 group-data-[template=landing-v3]/template:ms-4 group-data-[template=landing-v3]/template:mt-5 group-data-[template=landing-v3]/template:border sm:group-data-[template=landing-v3]/template:ms-[calc((100vw/20)+16px)] md:group-data-[template=landing-v3]/template:ms-[calc((100vw/10)+16px)]",
        className={cn(
          "mobile:hidden bg-primary-50 rounded-t-none border-transparent group-data-[template=landing-v3]/template:mt-2 group-data-[template=landing-v3]/template:bg-transparent group-data-[template=landing-v3]/template:px-4 sm:group-data-[template=landing-v3]/template:px-5",
          "border-b-gray-light border-b",
          // {
          //   "ms-4 mt-5": template == 3,
          // },
        )}
      >
        <div className="wrapper group-data-[template=landing-v3]/template:bg-background flex flex-col gap-2 py-4 group-data-[template=landing-v3]/template:rounded-lg">
          <Link
            href={"/login"}
            className={cn(
              "border-primary-800 text-primary-800 mx-auto flex w-full items-center justify-center rounded-[10px] border bg-transparent p-2 text-center font-bold outline-offset-1 outline-red-500",
              {
                "bg-primary-800 text-white": pathName.startsWith("/login"),
              },
            )}
          >
            <DropdownMenuItem className="cursor-pointer">
              تسجيل دخول
            </DropdownMenuItem>
          </Link>

          <Link
            href={"/register"}
            className={cn(
              "border-primary-800 text-primary-800 mx-auto flex w-full items-center justify-center rounded-[10px] border bg-transparent p-2 text-center text-[18px] font-bold",
              {
                "bg-primary-800 text-white": pathName.startsWith("/register"),
              },
            )}
          >
            <DropdownMenuItem className="cursor-pointer">
              إنشاء حساب
            </DropdownMenuItem>
          </Link>

          <div className="border-gray-light flex w-full items-center justify-center gap-2 rounded-[10px] border p-2 md:hidden">
            <Link href="/#grades" className="flex w-full justify-center">
              <DropdownMenuItem>
                <h3>الصفوف الدراسية</h3>
                <img
                  className="h-[32px] w-[32px]"
                  src="/assets/books-colored.svg"
                />
              </DropdownMenuItem>
            </Link>
          </div>

          {/* <WrapperHOC queryKey={["settings/books"]}>
          {({ data }: { data: { data: BookLinksSettings } }) => {
            const booksData = data?.data;
            if (!booksData?.links?.length) return null;

            return (
              <div className="border flex w-full  items-center justify-center gap-2 rounded-[10px] border-gray-light p-2">
                <Link href="/books" className="w-full flex justify-center">
                  <DropdownMenuItem>
                    <h3>الكتب</h3>
                    <img
                      className="w-[32px] h-[32px]"
                      src="/assets/BookColor.svg"
                    />
                  </DropdownMenuItem>
                </Link>
              </div>
            );
          }}
        </WrapperHOC> */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GuestDropdown;
