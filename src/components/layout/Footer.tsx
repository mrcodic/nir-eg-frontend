import { getPublicData } from "@/config/client-fetch";
import { footerLinks, navlinks } from "@/constants/navlinks";
import { FooterData } from "@/types/type";
import { MapPin } from "lucide-react";
import Image from "next/image";
import CustomLink from "../CustomLink";
import SocialLinks from "../SocialLinks";

async function Footer() {
  let footerData: FooterData | undefined = undefined;

  try {
    const data: { data: FooterData } | null = await getPublicData({
      queryKey: ["/settings/contact-us"],
    });

    footerData = data?.data;
  } catch (error) {
    console.log("footer data error : ", error);
  }

  return (
    // bg-[url('/assets/backgrounds/bg-vector.png')]
    <footer className="bg-background   wrapper py-10">
      <div className="section  flex flex-col gap-6">
        <div className="grid grid-cols-12  items-start w-full gap-y-6">
          <div className="flex flex-col gap-4 col-span-12 md:col-span-5 md:max-w-4/5">
            <Image src="/logo.svg" width={110} height={48} alt="logo image" />
            <p className="text-slate-600 font-bold text-sm">
              نَيِّر - Nir هو نظام إدارة التعليم يهدف إلى سد احتياجات المؤسسات
              التعليمية الحديثة
            </p>
          </div>

          <nav className=" col-span-12 md:col-span-3 md:justify-self-center">
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

          <div className="space-y-4 col-span-12 md:col-span-3 md:col-start-10 md:justify-self-end">
            <SocialLinks
              className="pb-2 border-b border-gray-light w-fit flex-nowrap"
              links={footerData?.socials}
            />

            <div className="flex flex-col gap-4 flex-wrap text-sm">
              {footerData?.address_1 && (
                <a
                  href={`https://maps.google.com/?q=${footerData?.address_1}`}
                  target="_blank"
                  className="flex items-center gap-4"
                >
                  <MapPin className="stroke-primary-800 size-5 shrink-0" />
                  <span>{footerData?.address_1}</span>
                </a>
              )}
              {footerData?.address_2 && (
                <a
                  href={`https://maps.google.com/?q=${footerData?.address_2}`}
                  target="_blank"
                  className="flex items-center gap-4"
                >
                  <MapPin className="stroke-primary-800 size-5 shrink-0" />
                  <span>{footerData?.address_2}</span>
                </a>
              )}
              {footerData?.email && (
                <a
                  href={`mailto:${footerData?.email}`}
                  className="flex items-center gap-4"
                >
                  <Image
                    src="/assets/email.svg"
                    width={20}
                    height={20}
                    alt="email"
                    className="shrink-0"
                  />
                  <span>{footerData?.email}</span>
                </a>
              )}
              {footerData?.phone_sa && (
                <a
                  href={`tel:${footerData?.phone_sa}`}
                  className="flex items-center gap-4"
                >
                  <Image
                    src="/assets/phone.svg"
                    width={20}
                    height={20}
                    alt="phone"
                    className="shrink-0"
                  />
                  <span dir="ltr">+{footerData?.phone_sa}</span>
                </a>
              )}
              {footerData?.phone && (
                <a
                  href={`tel:${footerData?.phone}`}
                  className="flex items-center gap-4"
                >
                  <Image
                    src="/assets/phone.svg"
                    width={20}
                    height={20}
                    alt="email"
                    className="shrink-0"
                  />
                  <span dir="ltr">+{footerData?.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex  gap-y-4   flex-col">
          <div className="flex items-center md:ms-auto max-sm:flex-wrap justify-center gap-x-2">
            {footerLinks.map((link) => (
              <CustomLink
                key={link.name}
                href={link.href}
                name={link.name}
                className="text-sm lg:text-sm md:text-sm"
              />
            ))}
          </div>
          <div className="border-primary-800 flex flex-col items-center gap-1 border-t pt-4 text-[11px] text-center">
            <p>
              © جميع الحقوق محفوظة لدى نير - Nir-edu {new Date().getFullYear()}{" "}
              - المملوكة لشركة بكسبايت للبرمجة وتكنولوجيا المعلومات
              <a
                target="_blank"
                href={"https://pixbyte.co/"}
                className="text-primary ms-1 font-bold underline"
              >
                Pixbyte
              </a>
            </p>
            <p>
              الرقم الموحد للسجل التجاري :{" "}
              <span
                style={{
                  unicodeBidi: "plaintext",
                }}
              >
                11090 06000 08549
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
