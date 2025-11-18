import { footerLinks } from "@/constants/navlinks";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "../SocialLinks";

function Footer() {
  return (
    <footer className="bg-background bg-[url('/bg-vector.svg')] wrapper py-10">
      <div className="max-w-7xl mx-auto  flex flex-col gap-6">
        <div className="flex gap-6 items-start flex-wrap w-full">
          <Image src="/logo.svg" width={110} height={48} alt="logo image" />

          <nav className="lg:ms-auto pt-3 pe-8 max-md:w-full">
            <ul className="flex max-md:flex-col items-start gap-6 md:items-center flex-wrap">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="font-bold text-lg p-2">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <SocialLinks className="ms-auto" />
        </div>

        <div className="w-full flex justify-between gap-6 items-center flex-wrap">
          <p className="text-slate-600 font-bold text-sm">
            © جميع الحقوق محفوظة لدى نَيِّر - Nir 2024
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <Mail className="size-5 stroke-accent-800" />
              <span>info@nir-edu.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="size-5 stroke-accent-800" />
              <span>+966 0596207549</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="size-5 stroke-accent-800" />
              <span>+20 15000 48 141</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
