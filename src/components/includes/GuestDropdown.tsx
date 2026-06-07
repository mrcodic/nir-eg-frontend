"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SwitchTenantButton from "./SwitchTenantButton";

type NavLink = {
  href: string;
  label: string;
  className?: string;
  icon?: { src: string; alt: string };
};

function GuestDropdown() {
  const pathName = usePathname();
  const { features } = useTenant();

  const navLinks: NavLink[] = [
    {
      href: "/login",
      label: "تسجيل دخول",
    },
    {
      href: "/register",
      label: "إنشاء حساب",
    },
    {
      href: "/#grades",
      label: "الصفوف الدراسية",
      className: "lg:hidden",

      icon: { src: "/assets/books-colored.svg", alt: "books-colored icon" },
    },
    ...(features?.book_store
      ? [
          {
            href: "/books",
            label: "الكتب",
            className: "lg:hidden",

            icon: {
              src: "/assets/icons/BookColor.svg",
              alt: "book colored icon",
            },
          } satisfies NavLink,
        ]
      : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-10 items-center justify-center rounded-lg bg-white px-1 shadow-md xl:hidden">
        <MenuIcon size={24} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={18}
        className={cn(
          "bg-primary-50 rounded-t-none border-transparent group-data-[template=landing-v3]/template:mt-2 group-data-[template=landing-v3]/template:bg-transparent group-data-[template=landing-v3]/template:px-4 sm:group-data-[template=landing-v3]/template:px-5 xl:hidden",
          "border-b-gray-light border-b",
        )}
      >
        <div className="wrapper group-data-[template=landing-v3]/template:bg-background flex flex-col gap-2 py-4 group-data-[template=landing-v3]/template:rounded-lg">
          {navLinks.map(({ href, label, className, icon }) => (
            <DropdownMenuItem key={href} asChild>
              <Link
                href={href}
                className={cn(
                  "border-primary-800 text-primary-800 mx-auto flex w-full cursor-pointer items-center justify-center rounded-[10px] border bg-transparent p-2 text-center font-bold outline-offset-1 outline-red-500",
                  className,
                  {
                    "bg-primary-800 text-white": pathName.startsWith(href),
                  },
                )}
              >
                {icon && (
                  <Image
                    width={24}
                    height={24}
                    className="size-6"
                    src={icon.src}
                    alt={icon.alt}
                  />
                )}
                <h3>{label}</h3>
              </Link>
            </DropdownMenuItem>
          ))}

          <SwitchTenantButton
            className="mx-auto w-full rounded-[10px] font-bold"
            label="اختيار منصة أخرى"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GuestDropdown;
