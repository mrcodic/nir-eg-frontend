import { footerLinks } from "@/constants/navlinks";
import Image from "next/image";
import CustomLink from "../CustomLink";
import SocialLinks from "../SocialLinks";

function Footer() {
  return (
    <footer className="bg-background bg-[url('/bg-vector.png')] wrapper py-10">
      <div className="max-w-7xl mx-auto  flex flex-col gap-6">
        <div className="flex gap-6 items-start flex-wrap w-full">
          <Image src="/logo.svg" width={110} height={48} alt="logo image" />

          <nav className="lg:ms-auto pt-3 pe-8 max-md:w-full">
            <ul className="flex max-md:flex-col items-start gap-6 md:items-center flex-wrap">
              {footerLinks.map((link) => (
                <CustomLink key={link.name} link={link} />
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
              <Image
                src="/assets/email.svg"
                width={20}
                height={20}
                alt="phone"
              />
              <span>info@nir-edu.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Image
                src="/assets/phone.svg"
                width={20}
                height={20}
                alt="phone"
              />
              <span dir="ltr">+966 0596207549</span>
            </div>
            <div className="flex items-center gap-4">
              <Image
                src="/assets/phone.svg"
                width={20}
                height={20}
                alt="email"
              />
              <span dir="ltr">+20 15000 48 141</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
