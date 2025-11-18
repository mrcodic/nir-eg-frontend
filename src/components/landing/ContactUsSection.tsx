import Image from "next/image";
import ContactUsForm from "../form/ContactUsForm";

export default function ContactUsSection() {
  return (
    <section className="wrapper w-full ">
      <div className="max-w-7xl mx-auto bg-[url('/bg-vector.svg')] p-4 bg-background rounded-lg grid grid-cols-2 relative">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ContactUsForm />
        </div>

        {/* Left hero/illustration side */}
        <div className="hidden  lg:flex flex-col justify-center px-8  rounded-lg">
          <Image
            src="/logo.svg"
            alt="logo"
            className="mb-10"
            width={144}
            height={61}
          />
          <h2 className="text-3xl font-semibold mb-4">
            احصل على{" "}
            <span className="text-primary-800 drop-shadow-text ">
              النسخة التجريبية
            </span>{" "}
            الآن
          </h2>

          <p className="text-slate-600 text-xl">
            ابدأ رحلتك مع تير، و احصل على النسخة التجريبية الآن
          </p>
          <Image
            src="/assets/lightbulb.png"
            alt="light bulbs"
            className="aspect-square max-w-full mx-auto"
            width={334}
            height={334}
          />
        </div>
      </div>
    </section>
  );
}
