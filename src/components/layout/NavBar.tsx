import { navlinks } from "@/constants/navlinks";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

function NavBar() {
  return (
    <header className="lg:h-22 wrapper py-6 border-b border-gray-light w-full fixed top-0 flex items-center justify-between bg-background z-20">
      <Image src="/logo.svg" alt="logo" width={110} height={48} className="" />

      <nav>
        <ul className="flex gap-8">
          {navlinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="font-bold text-lg p-2">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Button>احصل على النسخة التجريبية</Button>
    </header>
  );
}

export default NavBar;
