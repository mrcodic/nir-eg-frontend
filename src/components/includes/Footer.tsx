import { getServerData } from "@/helpers/server-fetch";
import { IFooterData } from "@/types/settings.types";
import Link from "next/link";
import SocialLinks from "../shared/SocialLinks";
import CustomImage from "../ui/CustomImage";
import FooterContacts from "./FooterContacts";

const Footer = async () => {
  const footerResponse = await getServerData<{ data: IFooterData }>({
    queryKey: ["settings/footer"],
    isAuth: false,
    next: {
      revalidate: 60 * 20,
    },
  });

  const footerSettings = footerResponse?.data;

  return (
    <footer
      key="footer"
      className="bg-background py-10 text-center font-semibold text-black"
      suppressHydrationWarning
    >
      <div className="wrapper grid grid-cols-12 justify-between gap-y-6 md:text-right">
        {/* About Section */}
        <div className="mobile:col-span-4 col-span-12 flex flex-col items-start gap-4">
          <Link href={""} className="gap-2">
            <CustomImage
              src={footerSettings?.image || "/logo.svg"}
              fallback="/logo.svg"
              className="h-12 w-[110px] object-contain object-right"
              width={110}
              height={48}
              alt="logo"
            />
          </Link>

          <p className="text-right text-sm leading-relaxed font-bold">
            {footerSettings?.description}
          </p>
        </div>

        {/* Contact Section */}
        <FooterContacts contacts={footerSettings?.contacts} />

        {/* Social Media Section */}

        <SocialLinks
          className="mobile:col-span-2 mobile:col-start-11 mobile:justify-end col-span-12 flex flex-nowrap items-start justify-center"
          links={footerSettings?.social}
        />
      </div>

      <div className="wrapper mt-8 flex flex-wrap-reverse justify-between gap-8 text-center">
        <div>
          © جميع الحقوق محفوظة لدى نير - Nir 2026 - تم التصميم والتطوير بواسطة
          <a
            target="_blank"
            href={"https://pixbyte.co/"}
            className="text-primary ms-1 text-base font-bold underline"
          >
            Pixbyte.co
          </a>
        </div>

        <div className="mobile:ms-auto max-mobile:w-full flex flex-wrap justify-center gap-x-6 gap-y-4 text-sm">
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
