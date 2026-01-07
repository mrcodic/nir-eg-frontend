import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "../SocialLinks";

const Footer = () => {
  return (
    <footer className="bg-background py-10 text-center font-semibold text-black">
      <div className="wrapper grid grid-cols-12 justify-between gap-y-6 md:text-right">
        {/* About Section */}
        <div className="mobile:col-span-4 col-span-12 flex flex-col items-start gap-4">
          <Link href={""} className="gap-2">
            <Image src="/logo.svg" width={110} height={48} alt="logo" />
          </Link>

          <p className="text-right text-sm leading-relaxed font-bold">
            More English هي مؤسسة تعليمية تهدف إلى تقديم أفضل الخدمات التعليمية
            والتدريبية في اللغة الإنجليزية، تعمل على توفير بيئة تعليمية متطورة
            تساعد على تحقيق الأهداف الشخصية والمهنية مع التركيز على تقديم دعم
            مستمر وخدمات متكاملة لاحتياجاتك.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mobile:col-span-4 mobile:mx-auto mobile:w-fit mobile:col-start-6 col-span-12 space-y-2">
          <h3 className="mb-4 text-right text-[16px] font-semibold">
            تواصل معنا
          </h3>
          <p className="text-start text-sm font-bold">
            إذا كان لديك أي استفسارات أو تحتاج إلى دعم، يُرجى التواصل معنا عبر:
          </p>
          <p className="mt-2 flex gap-4 text-sm">
            <Mail size={20} className="text-primary" />{" "}
            <a
              href="mailto:info@more-english.com"
              className="underline hover:text-black/80"
            >
              info@more-english.com
            </a>
          </p>
          <div className="mt-1 flex gap-4 text-sm">
            <div>
              <Phone size={20} className="text-primary" />{" "}
            </div>
            <a
              href="tel:+201008673565"
              className="underline hover:text-black/80"
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

            <p className="mt-1 text-sm">شارع الثورة ، القاهرة، مصر</p>
          </div>
        </div>

        {/* Social Media Section */}

        <SocialLinks className="mobile:col-span-2 mobile:col-start-11 col-span-12 flex flex-nowrap items-start justify-end" />
      </div>

      <div className="wrapper mt-8 flex flex-wrap-reverse justify-between gap-8 text-center">
        <div>
          © جميع الحقوق محفوظة لدى نير - Nir 2026 - تم التصميم والتطوير بواسطة
          <a
            target="_blank"
            href={"https://pixbyte.co/"}
            className="text-primary ms-1 text-[16px] font-bold underline"
          >
            Pixbyte.co
          </a>
        </div>

        <div className="ms-auto flex flex-wrap justify-center gap-x-6 gap-y-4 text-sm">
          <Link href={"/terms"} className="flex items-center gap-4 underline">
            الشروط و الأحكام
          </Link>
          <Link href={"/privacy"} className="flex items-center gap-4 underline">
            سياسة الخصوصية
          </Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
