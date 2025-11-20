"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GuestDropdown from "./GuestDropdown";

const GuestNavBar = () => {
  const pathname = usePathname();

  return (
    <div
      style={{
        boxShadow: "0px 2px 4px 2px rgba(157,130,66,0.10)",
      }}
      className=" h-20  border-b fixed top-0 left-0 w-full z-30 border-secondary flex items-center  bg-background  aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!"
    >
      <div className="wrapper ">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex  items-center self-end font-bold gap-12 lg:gap-[120px]">
            <Link href={"/"}>
              <Image
                className=""
                width={110}
                height={48}
                src="/logo.svg"
                alt="logo icon"
              />
            </Link>

            {/* <div className="hidden md:flex gap-2">
                <Link
                  href="/#grades"
                  className={cn(
                    "border  transition-all lg:text-base text-sm  cursor-pointer   hidden md:flex items-center gap-2 rounded-[10px] border-primary-700 p-2 justify-center",
                    {
                      "bg-primary text-white": pathname === "/",
                      "bg-transparent text-[#523412]": pathname !== "/",
                    }
                  )}
                >
                  <img
                    className="w-[32px] h-[32px]"
                    src="/assets/GradeColor.svg"
                  />
                  <h3>الصفوف الدراسية</h3>
                </Link>

                <WrapperHOC queryKey={["settings/books"]}>
                  {({ data }: { data: { data: BookLinksSettings } }) => {
                    const booksData = data?.data;

                    if (!booksData?.links?.length) return null;

                    return (
                      <Link
                        href="/books"
                        className={`border  transition-all  lg:text-base text-sm cursor-pointer hidden md:flex items-center gap-2 rounded-[10px] border-primary-700 p-2 justify-center ${
                          pathname === "/books"
                            ? "bg-primary text-white"
                            : "bg-transparent text-[#523412]"
                        }   `}
                      >
                        الكتب
                      </Link>
                    );
                  }}
                </WrapperHOC>
              </div> */}
          </div>

          <div className="flex  gap-3">
            {/* <button className="w-[40px] cursor-pointer relative h-[40px] flex items-center justify-center rounded-lg bg-white md:hidden">
                <span className="bg-[#B75050] absolute -top-1 -right-1 inline-block text-center rounded-full text-white w-[12px] h-[12px] text-[10px]">
                  3
                </span>
                <img src="/assets/Notification.svg" />
              </button> */}
            {/* <WrapperHOC queryKey={["settings/books"]}>
                {({ data }: { data: { data: BookLinksSettings } }) => {
                  if (data?.data?.hide_books) return;
                  return <NavCartButton />;
                }}
              </WrapperHOC> */}
            <GuestDropdown />
          </div>

          <div className="md:flex  gap-4 lg:gap-6 hidden">
            <Link
              href={"/login"}
              className="border transition-all lg:text-base text-sm hover:bg-[#F6EADE] text-center font-bold bg-transparent p-2 text-[18px] text-secondary  border-secondary w-[135px] lg:w-[159px] rounded-[10px]"
            >
              <span>تسجيل دخول</span>
            </Link>
            <Link
              href="/register"
              className="text-center lg:text-base text-sm font-bold bg-primary-800 after:w-0.5 after   p-2  text-white w-[135px] lg:w-[159px] rounded-[10px]"
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
