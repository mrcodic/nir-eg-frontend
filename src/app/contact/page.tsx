import ContactUsSection from "@/components/landing/ContactUsSection";
import SocialLinks from "@/components/SocialLinks";

function page() {
  return (
    <main className="flex w-full flex-col gap-22 my-22">
      <ContactUsSection />

      <section className="flex flex-col mx-auto max-w-7xl">
        <div className="relative px-20 text-center">
          <hr className="bg-primary-100 absolute top-1/2 w-full left-1/2 -translate-x-1/2 h-1 z-1" />
          <h2 className="text-xl font-bold bg-white  text-gray-dark px-2 relative z-2">
            يمكنك متابعتنا على وسائل التواصل الاجتماعي
          </h2>
        </div>

        <SocialLinks className="mx-auto mt-8" />
      </section>
    </main>
  );
}

export default page;
