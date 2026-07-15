import { getServerData } from "@/helpers/fetchers/server-fetch";
import { IFooterData } from "@/types/settings.types";
import { headers } from "next/headers";
import Link from "next/link";
import SocialLinks from "../shared/SocialLinks";
import CustomImage from "../ui/CustomImage";
import FooterContacts from "./FooterContacts";

const Footer = async () => {
  const footerResponse = await getServerData<{ data: IFooterData }>({
    queryKey: ["settings/footer"],
    isAuth: false,
    next: {
      revalidate: 60 * 10,
    },
    cache: "default",
  });

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  const footerSettings = footerResponse?.data;

  if (pathname.startsWith("/parent-portal") || pathname.startsWith("/short"))
    return null;

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
              className="h-12 w-fit object-contain object-right"
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

      <div className="wrapper mt-8 flex flex-col gap-4 text-center">
        <div className="mobile:ms-auto max-mobile:w-full flex flex-wrap justify-center gap-x-6 gap-y-4 text-sm">
          <Link
            href={"https://nir-edu.com/terms"}
            className="flex items-center gap-4 underline"
            target="_blank"
          >
            الشروط و الأحكام
          </Link>
          <Link
            href={"https://nir-edu.com/privacy"}
            className="flex items-center gap-4 underline"
            target="_blank"
          >
            سياسة الخصوصية
          </Link>
        </div>

        <div className="border-primary-800 flex flex-col items-center gap-1 border-t pt-4 text-center text-[11px]">
          <p>
            © جميع الحقوق محفوظة لدى نير - Nir-edu {new Date().getFullYear()} -
            المملوكة لشركة بكسبايت للبرمجة وتكنولوجيا المعلومات
            <a
              target="_blank"
              href={"https://pixbyte.co/"}
              className="text-primary ms-1 font-bold underline"
            >
              Pixbyte
            </a>
          </p>
          <p>
            الرقم الموحد للسجل التجاري :  {" "}
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
    </footer>
  );
};
export default Footer;
