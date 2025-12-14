"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { StudentSelectCenterModal } from "../modals/StudentSelectCenterModal";

function LinkStyled({ href, title }: { href: string; title: string }) {
  const modal = useModal();
  const pathname = usePathname() ?? "/";
  const { profile } = useAuthContext();

  const isActive = href.substring(0, 6) === pathname.substring(0, 6);

  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const activeOrHover = isActive || isHover || isFocus;

  function center(
    e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent,
    x: boolean
  ) {
    if (!x) return;
    if (x && profile?.has_center === false) {
      modal.setDialogContent(<StudentSelectCenterModal />);
      modal.openModal();
    }
  }

  return (
    <Link
      href={href}
      onClick={(e) =>
        center(e as React.MouseEvent<HTMLAnchorElement>, title === "الحصص")
      }
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      className={`relative px-3 h-11 flex flex-col items-center justify-center rounded-[10px] font-bold transition-colors duration-150 ${
        activeOrHover ? "text-black" : "text-gray-dark"
      }`}
    >
      {title}

      {/* underline — animate based on activeOrHover */}
      <motion.div
        className="h-0.5 bg-secondary origin-right w-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: activeOrHover ? 0.5 : 0 }}
        transition={{ duration: 0.18 }}
        aria-hidden
      />
    </Link>
  );
}

export default LinkStyled;
