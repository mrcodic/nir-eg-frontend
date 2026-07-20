import { mapSummaryNavigation } from "@/helpers/map-summary-landing-content";
import { IFooterData } from "@/types/settings.types";
import type { LandingPageHeader } from "@/types/tenant.types";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import SocialLinks from "../shared/SocialLinks";
import CustomImage from "../ui/CustomImage";

function SummaryFooter({
  footerSettings,
  header,
}: {
  footerSettings?: IFooterData;
  header: LandingPageHeader;
}) {
  const contacts = footerSettings?.contacts;
  const navigation = mapSummaryNavigation(header);

  const hasContacts =
    contacts?.phone_1 || contacts?.email || contacts?.location;

  return (
    <footer
      id="summary-footer"
      className="bg-primary-800 pt-12 pb-4 text-white"
    >
      <div className="wrapper grid gap-10 text-center sm:grid-cols-2 sm:text-right lg:grid-cols-3">
        <div>
          <CustomImage
            src={footerSettings?.image || "/logo.svg"}
            fallback="/logo.svg"
            width={126}
            height={52}
            alt="شعار المنصة"
            className="mx-auto h-12 w-auto object-contain object-right sm:mx-0"
          />

          {!!footerSettings?.description && (
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
              {footerSettings?.description}
            </p>
          )}

          {!!footerSettings?.social?.length && (
            <div className="mt-5 flex justify-center sm:justify-start">
              <SocialLinks
                links={footerSettings?.social ?? []}
                className="gap-3"
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-extrabold">الصفحات</h2>
          <nav
            aria-label="روابط الصفحة"
            className="mt-4 grid gap-2 text-sm text-white/80"
          >
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {!!hasContacts && (
          <div>
            <h2 className="text-lg font-extrabold">تواصل معنا</h2>
            <div className="mt-4 grid gap-3 text-sm text-white/80">
              {contacts?.phone_1 && (
                <a
                  href={`tel:${contacts.phone_1}`}
                  className="flex items-center justify-center gap-2 sm:justify-start"
                  dir="ltr"
                >
                  <Phone aria-hidden className="text-secondary size-4" />
                  {contacts.phone_1}
                </a>
              )}
              {contacts?.email && (
                <a
                  href={`mailto:${contacts.email}`}
                  className="flex items-center justify-center gap-2 sm:justify-start"
                >
                  <Mail aria-hidden className="text-secondary size-4" />
                  {contacts.email}
                </a>
              )}
              {contacts?.location && (
                <p className="flex items-center justify-center gap-2 sm:justify-start">
                  <MapPin aria-hidden className="text-secondary size-4" />
                  {contacts.location}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-primary-50/50 mt-4 flex flex-col items-center gap-1 border-t pt-4 text-center text-[11px]">
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
    </footer>
  );
}

export default SummaryFooter;
