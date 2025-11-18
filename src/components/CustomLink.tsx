"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

function CustomLink({ link }: { link: { name: string; href: string } }) {
  const pathname = usePathname();
  const isActive = pathname === link.href;
  return (
    <div className="relative">
      <Link
        href={link.href}
        className={cn(
          "font-bold text-gray-dark text-lg p-2 transition hover:opacity-80",
          {
            "text-black": isActive,
          }
        )}
      >
        {link.name}
      </Link>
      <motion.div
        className=" ms-2 bg-secondary absolute h-0.5"
        initial={{ width: 0 }}
        animate={{ width: isActive ? "40px" : 0 }}
      />
    </div>
  );
}

export default CustomLink;
