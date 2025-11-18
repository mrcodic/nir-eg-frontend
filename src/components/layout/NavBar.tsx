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
    <header className="fixed inset-x-0 top-0 z-30 border-b border-gray-light">
      <div className="wrapper relative flex h-20 items-center justify-between bg-background z-30">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={110} height={48} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {navlinks.map((link) => (
              <li key={link.name}>
                <CustomLink link={link} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button>احصل على النسخة التجريبية</Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
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
              className="absolute left-0 right-0 top-full z-20 border-b border-gray-light bg-background shadow-md md:hidden"
            >
              <nav className="flex flex-col gap-2 px-4 py-4">
                {navlinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="py-2 text-base font-medium"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                ))}

                <Button className="mt-3 w-full" onClick={closeMenu}>
                  احصل على النسخة التجريبية
                </Button>
              </nav>
            </motion.div>

            {/* Overlay */}
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-10 bg-black/40 md:hidden"
              onClick={closeMenu}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default NavBar;
