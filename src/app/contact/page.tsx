import ContactUsSection from "@/components/landing/ContactUsSection";
import SocialLinks from "@/components/SocialLinks";
import MappingFun from "@/config/MappingFun";
import { FooterData } from "@/types/type";
import { Metadata } from "next";
import { preload } from "react-dom";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق نَيِّر للاستفسارات والدعم الفني.",
};

function page() {
  preload("/bg-vector.png", { as: "image", fetchPriority: "high" });

  return (
    <main className="flex w-full flex-col gap-22 md:my-22 my-16">
      <ContactUsSection />

      <MappingFun
        arraypath="data.socials"
        queryKey={"/settings/contact-us"}
        returnEmptyState={true}
        render={({ data }: { data: FooterData }) => {
          console.log("data : ", data);
          return (
            <section className="flex flex-col  wrapper ">
              <div className="relative sm:px-20 px-10 text-center mx-auto">
                <hr className="bg-primary-100 absolute top-1/2 w-full left-1/2 -translate-x-1/2 h-1 z-1" />
                <h2 className="sm:text-xl text-lg font-bold bg-white  text-gray-dark px-2 relative z-2">
                  يمكنك متابعتنا على وسائل التواصل الاجتماعي
                </h2>
              </div>

              <SocialLinks className="mx-auto mt-8" links={data?.socials} />
            </section>
          );
        }}
      />
    </main>
  );
}

export default page;
