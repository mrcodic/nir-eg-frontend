"use client";

import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomImage from "../ui/CustomImage";
import GuestDropdown from "./GuestDropdown";

const GuestNavBar = () => {
  const pathname = usePathname();
  const { logo, features } = useTenant();

  const guestLinks = [
    {
      text: "الصفوف الدراسية",
      href: "/#grades",
      icon: "/assets/books-colored.svg",
      show: true,
    },
    {
      text: "الكتب",
      href: "/books",
      icon: "/assets/icons/BookColor.svg",
      show: features?.book_store,
    },
  ];

  return (
    <div
      className={cn(
        "border-secondary bg-background fixed top-0 left-0 z-30 flex h-20 w-full items-center border-b group-data-[template=landing-v3]/template:h-28 group-data-[template=landing-v3]/template:items-end group-data-[template=landing-v3]/template:border-none group-data-[template=landing-v3]/template:bg-transparent aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!",
        // {
        //   "h-28 items-end border-none bg-transparent": template == 3,
        // },
      )}
    >
      <div className="wrapper">
        <div
          className={cn(
            "group-data-[template=landing-v3]/template:bg-background group-data-[template=landing-v3]/template:border-gray-light flex items-center justify-between gap-2 group-data-[template=landing-v3]/template:rounded-lg group-data-[template=landing-v3]/template:border group-data-[template=landing-v3]/template:p-4",
            //    {
            //   "bg-background border-gray-light rounded-lg border p-4":
            //     template == 3,
            // }
          )}
        >
          <div className="mobile:gap-20 flex items-center gap-12 self-end font-bold">
            <Link href={"/"}>
              <CustomImage
                src={logo || "/logo.svg"}
                fallback="/logo.svg"
                width={110}
                height={48}
                unoptimized
                className="h-12 object-contain object-right"
                loading="eager"
                fetchPriority="high"
                alt="logo"
                priority
              />
            </Link>

            <div className="hidden gap-2 md:flex">
              {guestLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "mobile:text-base border-gray-light hidden cursor-pointer items-center justify-center gap-2 rounded-[10px] border p-2 text-sm transition-all md:flex",
                    {
                      "bg-primary-800 text-white": pathname === link.href,
                      "bg-transparent": pathname !== link.href,
                    },
                  )}
                >
                  <Image
                    width={32}
                    height={32}
                    className="size-8"
                    src={link.icon}
                    alt={link.text}
                  />
                  <h3>{link.text}</h3>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <GuestDropdown />
          </div>

          <div className="mobile:gap-6 mobile:flex hidden gap-4">
            <Link
              href={"/login"}
              className="mobile:text-base hover:bg-secondary-hover text-secondary border-secondary mobile:w-[170px] flex w-[135px] items-center justify-between gap-1 rounded-[10px] border bg-transparent p-2 text-center text-sm font-bold transition-all lg:text-lg"
            >
              <span
                className="bg-secondary inline-block size-6"
                style={{
                  maskImage: "url(/assets/icons/sign-out.svg)",
                  WebkitMaskImage: "url(/assets/icons/sign-out.svg)",
                }}
              />
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="mobile:text-base bg-primary-800 after mobile:w-[159px] hover:bg-primary-800/90 flex w-[135px] items-center justify-between gap-1 rounded-[10px] p-2 text-center text-sm font-bold text-white transition-all after:w-0.5 lg:text-lg"
            >
              <Image
                src="/assets/icons/add-user.svg"
                width={24}
                height={24}
                alt="sign out"
              />
              إنشاء حساب
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuestNavBar;
