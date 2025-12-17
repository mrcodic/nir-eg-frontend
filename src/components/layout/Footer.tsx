import { getPublicData } from "@/config/client-fetch";
import { footerLinks } from "@/constants/navlinks";
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
        revalidate: 60 * 60 * 60 * 24 * 7,
      },
    });

    footerData = data?.data;
  } catch (error) {
    console.log("footer data error : ", error);
  }

  console.log("footer data : ", footerData);

  return (
    <footer className="bg-background bg-[url('/bg-vector.png')] wrapper py-10">
      <div className="section  flex flex-col gap-6">
        <div className="flex gap-6 items-start flex-wrap w-full">
          <Image src="/logo.svg" width={110} height={48} alt="logo image" />

          <nav className="lg:ms-auto pt-3 pe-8 max-md:w-full">
            <ul className="flex max-md:flex-col items-start gap-6 md:items-center flex-wrap">
              {footerLinks.map((link) => (
                <CustomLink key={link.name} href={link.href} name={link.name} />
              ))}
            </ul>
          </nav>

          <SocialLinks className="ms-auto" links={footerData?.socials} />
        </div>

        <div className="w-full flex justify-between gap-6 items-center flex-wrap">
          <p className="text-slate-600 font-bold text-sm">
            © جميع الحقوق محفوظة لدى نَيِّر - Nir 2024
          </p>

          <div className="flex items-center gap-6 flex-wrap">
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
    </footer>
  );
}

export default Footer;
