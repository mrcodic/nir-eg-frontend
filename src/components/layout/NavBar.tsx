"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { navlinks } from "@/constants/navlinks";
import CustomLink from "../CustomLink";
import { Button } from "../ui/button";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-light  ">
      <div className="wrapper bg-background z-30 relative">
        <div className="section relative flex h-20 items-center justify-between  ">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              width={110}
              height={48}
              loading="eager"
              priority={true}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:block">
            <ul className="flex gap-6 xl:gap-8">
              {navlinks.map((link) => (
                <li key={link.name}>
                  <CustomLink
                    href={link.href}
                    name={link.name}
                    className="lg:text-sm xl:text-base whitespace-nowrap"
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/subscribe?type=demo"
            className="hidden lg:block lg:ms-auto lg:me-6 xl:me-0 xl:ms-0"
          >
            <Button>احصل على النسخة التجريبية</Button>
          </Link>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 xl:hidden">
            <Button
              size="icon"
              variant="ghost"
              className="xl:hidden"
              aria-label="Toggle menu"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="size-8" /> : <Menu className="size-8" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown + overlay with animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dropdown */}
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full z-20 border-b border-gray-light bg-background shadow-md xl:hidden"
            >
              <nav className="flex flex-col gap-4 pb-4 pt-6 wrapper">
                {navlinks.map((link) => (
                  <CustomLink
                    key={link.name}
                    href={link.href}
                    name={link.name}
                    className="py-2 text-base font-bold w-full"
                    onClick={closeMenu}
                  />
                ))}

                <Link href="/subscribe?type=demo" className="w-full mt-4">
                  <Button className="w-full" onClick={closeMenu}>
                    احصل على النسخة التجريبية
                  </Button>
                </Link>
              </nav>
            </motion.div>

            {/* Overlay */}
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-10 bg-black/40 xl:hidden"
              onClick={closeMenu}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default NavBar;
