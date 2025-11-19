import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    // <div className="  h-[249px]    bg-primary-700 bg-[url('/assets/footer.png')] text-white text-center py-[40px]">
    //   <div className="w-[85%] mx-auto flex flex-col items-center">
    //     <h2 className="text-[20px] font-bold text-white">تواصل معنا</h2>
    //     <div className="mt-[16px] flex-row-reverse flex gap-[32px]">
    //       <Link
    //         href={
    //           "https://www.facebook.com/people/More-English/100094080077402/"
    //         }
    //       >
    //         <img className="w-[48px] h-[48px]" src="/assets/Facebook.svg" />
    //       </Link>
    //       <Link href={"https://www.tiktok.com/@moreenglish6"}>
    //         <img className="w-[48px] h-[48px]" src="/assets/Tiktok.svg" />
    //       </Link>
    //       <Link href={"https://www.youtube.com/@moreenglish88"}>
    //         <img className="w-[48px] h-[48px]" src="/assets/Youtube.svg" />
    //       </Link>
    //       <Link
    //         href={
    //           "https://www.instagram.com/more_english88/?igshid=OGQ5ZDc2ODk2ZA==&utm_sour"
    //         }
    //       >
    //         <img className="w-[48px] h-[48px]" src="/assets/Instagram.svg" />
    //       </Link>
    //     </div>
    //     <div className="my-[24px] h-px w-full bg-[#F8DEC5]" />
    //     <h3 className="text-white text-[16px] font-medium">
    //       تم التصميم والتطوير بواسطة Pixbyte.co
    //     </h3>
    //   </div>
    // </div>
    <footer className="     bg-[#eecb79] bg-[url('/assets/footer.png')] text-[#523412] font-semibold  text-center py-[40px]">
      <div className=" max-w-[90%] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 justify-between gap-6  md:text-right">
        {/* About Section */}
        <div>
          <h3 className="text-[16px] text-start  font-semibold mb-4">من نحن</h3>

          <div className="flex items-start gap-4">
            <Link href={""} className=" gap-2">
              <img src="/assets/Logo.svg" className="w-[234px]" />
            </Link>

            <p className="md:text-sm font-bold text-right text-[12px] leading-relaxed">
              More English هي مؤسسة تعليمية تهدف إلى تقديم أفضل الخدمات
              التعليمية والتدريبية في اللغة الإنجليزية، تعمل على توفير بيئة
              تعليمية متطورة تساعد على تحقيق الأهداف الشخصية والمهنية مع التركيز
              على تقديم دعم مستمر وخدمات متكاملة لاحتياجاتك.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-2">
          <h3 className="md:text-[16px] text-[14px] text-right font-semibold mb-4  ">
            تواصل معنا
          </h3>
          <p className="md:text-sm  font-bold text-[12px]">
            إذا كان لديك أي استفسارات أو تحتاج إلى دعم، يُرجى التواصل معنا عبر:
          </p>
          <p className="text-sm mt-2 flex gap-4 ">
            <Mail size={20} />{" "}
            <a
              href="mailto:info@more-english.com"
              className="hover:text-gray-300 underline"
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
              className="hover:text-gray-300 underline "
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
        <div className="flex flex-col  items-center space-y-5">
          <h3 className="text-[16px] font-semibold mb-4   ">
            وسائل التواصل الاجتماعي
          </h3>
          <div className="mt-[16px] flex gap-6">
            <Link
              href={
                "https://www.facebook.com/people/More-English/100094080077402/"
              }
            >
              <img className="w-[34px] h-[34px]" src="/assets/Facebook.svg" />
            </Link>
            <Link href={"https://www.tiktok.com/@moreenglish6"}>
              <img className="w-[34px] h-[34px]" src="/assets/Tiktok.svg" />
            </Link>
            <Link href={"https://www.youtube.com/@moreenglish88"}>
              <img className="w-[34px] h-[34px]" src="/assets/Youtube.svg" />
            </Link>
            <Link
              href={
                "https://www.instagram.com/more_english88/?igshid=OGQ5ZDc2ODk2ZA==&utm_sour"
              }
            >
              <img className="w-[34px] h-[34px]" src="/assets/Instagram.svg" />
            </Link>
          </div>
        </div>
      </div>
      <div className="my-[24px] h-px w-full bg-[#F8DEC5]" />
      <div className="flex  flex-col justify-center gap-8 ">
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
