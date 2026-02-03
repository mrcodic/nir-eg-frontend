import { Contacts } from "@/types/settings.types";
import { Mail, MapPin, Phone } from "lucide-react";

function FooterContacts({ contacts }: { contacts: Contacts }) {
  return (
    <div className="mobile:col-span-4 mobile:mx-auto mobile:w-fit mobile:col-start-6 col-span-12 space-y-2 lg:pe-6">
      <h3 className="mb-4 text-right text-[16px] font-semibold">تواصل معنا</h3>
      <p className="text-start text-sm font-bold">
        إذا كان لديك أي استفسارات أو تحتاج إلى دعم، يُرجى التواصل معنا عبر:
      </p>

      {contacts?.email && (
        <p className="flex gap-4 text-sm">
          <Mail size={20} className="text-primary" />{" "}
          <a
            href={`mailto:${contacts.email}`}
            className="underline hover:text-black/80"
          >
            info@more-english.com
          </a>
        </p>
      )}

      {contacts?.phone_1 && (
        <div className="mt-1 flex gap-4 text-sm">
          <div>
            <Phone size={20} className="text-primary" />{" "}
          </div>
          <a
            href="tel:+201008673565"
            className="underline hover:text-black/80"
            dir="ltr"
          >
            {contacts?.phone_1}
          </a>
        </div>
      )}

      {contacts?.phone_2 && (
        <div className="mt-1 flex gap-4 text-sm">
          <div>
            <Phone size={20} className="text-primary" />{" "}
          </div>
          <a
            href="tel:+201008673565"
            className="underline hover:text-black/80"
            dir="ltr"
          >
            {contacts?.phone_2}
          </a>
        </div>
      )}

      {contacts?.location && (
        <div className="mt-1 flex gap-4">
          <span>
            <MapPin size={20} className="text-primary" />
          </span>

          <p className="text-sm">{contacts?.location}</p>
        </div>
      )}
    </div>
  );
}

export default FooterContacts;
