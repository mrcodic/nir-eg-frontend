import { getPublicData } from "@/config/client-fetch";
import { footerLinks, navlinks } from "@/constants/navlinks";
import { FooterData } from "@/types/type";
import Image from "next/image";
import CustomLink from "../CustomLink";
import SocialLinks from "../SocialLinks";

async function Footer() {
  let footerData: FooterData | undefined = undefined;

  try {
    const data: { data: FooterData } | null = await getPublicData({
      queryKey: ["/settings/contact-us"],
      next: {
        revalidate: 60 * 60 * 24 * 7,
      },
    });

    footerData = data?.data;
  } catch (error) {
    console.log("footer data error : ", error);
  }

  return (
    <footer className="bg-background bg-[url('/assets/backgrounds/bg-vector.png')] bg-no-repeat bg-cover wrapper py-10">
      <div className="section  flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start w-full">
          <div className="flex flex-col gap-4 sm:col-span-2 md:col-span-1">
            <Image src="/logo.svg" width={110} height={48} alt="logo image" />
            <p className="text-slate-600 font-bold text-sm">
              نَيِّر - Nir هو نظام إدارة التعليم يهدف إلى سد احتياجات المؤسسات
              التعليمية الحديثة
            </p>
          </div>

          <nav className=" w-full">
            <ul className="flex flex-col items-start gap-4 ">
              {navlinks.map((link) => (
                <li key={link.name}>
                  <CustomLink
                    href={link.href}
                    name={link.name}
                    className="lg:text-base "
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <SocialLinks
              className="pb-2 border-b border-gray-light w-fit"
              links={footerData?.socials}
            />

            <div className="flex flex-col gap-4 flex-wrap">
              {footerData?.email && (
                <div className="flex items-center gap-4">
                  <Image
                    src="/assets/email.svg"
                    width={20}
                    height={20}
                    alt="email"
                  />
                  <span>{footerData?.email}</span>
                </div>
              )}
              {footerData?.phone_sa && (
                <div className="flex items-center gap-4">
                  <Image
                    src="/assets/phone.svg"
                    width={20}
                    height={20}
                    alt="phone"
                  />
                  <span dir="ltr">+{footerData?.phone_sa}</span>
                </div>
              )}
              {footerData?.phone && (
                <div className="flex items-center gap-4">
                  <Image
                    src="/assets/phone.svg"
                    width={20}
                    height={20}
                    alt="email"
                  />
                  <span dir="ltr">+{footerData?.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center md:justify-between gap-y-4 gap-6 items-center flex-wrap-reverse">
          <p className="text-slate-600 font-bold text-sm">
            © جميع الحقوق محفوظة لدى نَيِّر - Nir 2024
          </p>

          <div className="flex items-center md:ms-auto max-sm:flex-wrap justify-center gap-x-2">
            {footerLinks.map((link) => (
              <CustomLink
                key={link.name}
                href={link.href}
                name={link.name}
                className="lg:text-sm md:text-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
