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

          <p className="md:text-sm font-bold text-right text-[12px] leading-relaxed">
            More English هي مؤسسة تعليمية تهدف إلى تقديم أفضل الخدمات التعليمية
            والتدريبية في اللغة الإنجليزية، تعمل على توفير بيئة تعليمية متطورة
            تساعد على تحقيق الأهداف الشخصية والمهنية مع التركيز على تقديم دعم
            مستمر وخدمات متكاملة لاحتياجاتك.
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-2 w-full grow">
          <h3 className="md:text-[16px] text-sm text-right font-semibold mb-4  ">
            تواصل معنا
          </h3>
          <p className="md:text-sm  font-bold text-[12px]">
            إذا كان لديك أي استفسارات أو تحتاج إلى دعم، يُرجى التواصل معنا عبر:
          </p>
          <p className="text-sm mt-2 flex gap-4 ">
            <Mail size={20} />{" "}
            <a
              href="mailto:info@more-english.com"
              className="hover:text-black/80 underline"
            >
              info@more-english.com
            </a>
          </p>
          <div className="text-sm mt-1 flex gap-4 ">
            <div>
              <Phone size={20} />{" "}
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
              <MapPin size={20} />
            </span>

            <p className="text-sm mt-1">شارع الثورة ، القاهرة، مصر</p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flex justify-end shrink-0 items-start">
          <SocialLinks />
        </div>
      </div>

      <div className="flex wrapper  justify-between gap-8 mt-8 ">
        <div>
          <a
            target="_blank"
            href={"https://pixbyte.co/"}
            className="  text-[16px] font-medium"
          >
            تم التصميم والتطوير بواسطة Pixbyte.co
          </a>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link href={"/terms"} className="flex gap-4 items-center underline ">
            <span className=" block size-2 bg-black rounded-full  " />
            الشروط و الأحكام
          </Link>
          <Link
            href={"/privacy"}
            className="flex gap-4 items-center underline "
          >
            <span className=" block size-2 bg-black rounded-full  " />
            سياسة الخصوصية
          </Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
