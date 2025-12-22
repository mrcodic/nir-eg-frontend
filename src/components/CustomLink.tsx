"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link> & { name: string };

function CustomLink({ name, ...props }: LinkProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  return (
    <div className="relative flex">
      <Link
        {...props}
        className={cn(
          "font-bold text-gray-dark md:text-base w-full lg:text-lg p-2 transition hover:opacity-80",
          {
            "text-black": isActive,
          },
          props.className
        )}
      >
        {name}
      </Link>

      <motion.div
        className=" ms-2 bg-secondary bottom-0 absolute h-0.5 shadow-secondary shadow-sm"
        initial={{ width: 0 }}
        animate={{ width: isActive ? "40px" : 0 }}
        whileHover={{ width: "40px" }}
      />
    </div>
  );
}

export default CustomLink;
