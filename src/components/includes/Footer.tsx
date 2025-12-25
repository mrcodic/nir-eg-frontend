import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "../SocialLinks";

const Footer = () => {
  return (
    <footer className="bg-background bg-[url('/assets/footer.png')] text-black font-semibold  text-center py-[40px]">
      <div className=" wrapper flex max-lg:flex-col justify-between gap-6  md:text-right">
        {/* About Section */}
        <div className="flex grow flex-col w-fit items-start gap-4">
          <Link href={""} className=" gap-2">
            <Image src="/logo.svg" width={110} height={48} alt="logo" />
          </Link>

          <p className=" font-bold text-right text-sm leading-relaxed">
            More English هي مؤسسة تعليمية تهدف إلى تقديم أفضل الخدمات التعليمية
            والتدريبية في اللغة الإنجليزية، تعمل على توفير بيئة تعليمية متطورة
            تساعد على تحقيق الأهداف الشخصية والمهنية مع التركيز على تقديم دعم
            مستمر وخدمات متكاملة لاحتياجاتك.
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-2 w-full grow">
          <h3 className="text-[16px] text-right font-semibold mb-4  ">
            تواصل معنا
          </h3>
          <p className="text-sm text-start  font-bold ">
            إذا كان لديك أي استفسارات أو تحتاج إلى دعم، يُرجى التواصل معنا عبر:
          </p>
          <p className="text-sm mt-2 flex gap-4 ">
            <Mail size={20} className="text-primary" />{" "}
            <a
              href="mailto:info@more-english.com"
              className="hover:text-black/80 underline"
            >
              info@more-english.com
            </a>
          </p>
          <div className="text-sm mt-1 flex gap-4 ">
            <div>
              <Phone size={20} className="text-primary" />{" "}
            </div>
            <a
              href="tel:+201008673565"
              className="hover:text-black/80 underline "
              dir="ltr"
            >
              +20 100 867 3565
            </a>
          </div>
          <div className="flex gap-4">
            <span>
              {" "}
              <MapPin size={20} className="text-primary" />
            </span>

            <p className="text-sm mt-1">شارع الثورة ، القاهرة، مصر</p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flex justify-end shrink-0 items-start">
          <SocialLinks />
        </div>
      </div>

      <div className="flex wrapper text-center  justify-between gap-8 mt-8 flex-wrap-reverse">
        <div>
          © جميع الحقوق محفوظة لدى نير - Nir 2026 - تم التصميم والتطوير بواسطة
          <a
            target="_blank"
            href={"https://pixbyte.co/"}
            className=" ms-1 text-[16px] font-bold underline text-primary "
          >
            Pixbyte.co
          </a>
        </div>

        <div className="flex text-sm justify-center gap-x-6 gap-y-4 flex-wrap ms-auto">
          <Link href={"/terms"} className="flex gap-4 items-center underline ">
            الشروط و الأحكام
          </Link>
          <Link
            href={"/privacy"}
            className="flex gap-4 items-center underline "
          >
            سياسة الخصوصية
          </Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
