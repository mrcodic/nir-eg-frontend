"use client";

import { getCurrentTemplate } from "@/helpers/template.helpers";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GuestDropdown from "./GuestDropdown";

const GuestNavBar = () => {
  const pathname = usePathname();
  const template = getCurrentTemplate();

  return (
    <div
      className={cn(
        " h-20  border-b fixed top-0 left-0 w-full z-30 border-secondary flex items-center  bg-background  aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!",
        {
          "bg-transparent h-28 items-end border-none": template == 3,
        }
      )}
    >
      <div className="wrapper ">
        <div
          className={cn("flex  items-center justify-between gap-2", {
            "bg-background p-4 rounded-lg border border-gray-light":
              template == 3,
          })}
        >
          <div className="flex  items-center self-end font-bold gap-12 mobile:gap-[120px]">
            <Link href={"/"}>
              <Image
                className=""
                width={110}
                height={48}
                src="/logo.svg"
                alt="logo icon"
              />
            </Link>

            <div className="hidden md:flex gap-2">
              <Link
                href="/#grades"
                className={cn(
                  "border  transition-all mobile:text-base text-sm  cursor-pointer   hidden md:flex items-center gap-2 rounded-[10px] border-gray-light p-2 justify-center",
                  {
                    "bg-primary-800 text-white": pathname === "/",
                    "bg-transparent ": pathname !== "/",
                  }
                )}
              >
                <img className="size-8" src="/assets/GradeColor.svg" />
                <h3>الصفوف الدراسية</h3>
              </Link>
            </div>
          </div>

          <div className="flex  gap-3">
            <GuestDropdown />
          </div>

          <div className="md:flex  gap-4 mobile:gap-6 hidden">
            <Link
              href={"/login"}
              className="border transition-all mobile:text-base text-sm hover:bg-secondary-hover text-center font-bold bg-transparent p-2 text-[18px] text-secondary  border-secondary w-[135px] mobile:w-[159px] rounded-[10px]"
            >
              <span>تسجيل دخول</span>
            </Link>
            <Link
              href="/register"
              className="text-center mobile:text-base text-sm font-bold bg-primary-800 after:w-0.5 after   p-2  text-white w-[135px] mobile:w-[159px] rounded-[10px] hover:bg-primary-800/90 transition-all"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuestNavBar;
