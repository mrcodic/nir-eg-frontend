import { getPublicData } from "@/config/client-fetch";
import { IPartner, ITestimonial } from "@/types/landing.types";
import { ApiResponse } from "@/types/type";
import LazyPartnersAndClients from "./LazyPartnersAndClients";

async function PartnersAndClientsSection() {
  let partners: ApiResponse<IPartner[]> | [] = [];
  let testimonials: ApiResponse<ITestimonial[]> | [] = [];

  try {
    [partners, testimonials] = await Promise.all([
      getPublicData({
        queryKey: ["/partners"],
      }) as Promise<ApiResponse<IPartner[]>>,
      getPublicData({
        queryKey: ["/testimonial"],
      }) as Promise<ApiResponse<ITestimonial[]>>,
    ]);
  } catch (error) {
    console.log(error);
    return null;
  }

  if (!partners?.data?.length && !testimonials?.data?.length) return null;

  return (
    <section className="wrapper w-full relative text-center  space-y-6">
      <div className="section">
        <div className="mb-6">
          <h3 className="text-32 font-bold">
            شركاؤنا فى{" "}
            <span className="text-primary-800 drop-shadow-text    ">
              {" "}
              النجاح{" "}
            </span>
          </h3>

          <p className="mt-4 text-lg font-bold text-gray-dark">
            وفرنا خدماتنا لنخبة من المدرسين و المراكز التعليمية
          </p>
        </div>

        <LazyPartnersAndClients
          partners={partners?.data}
          testimonials={testimonials?.data}
        />
      </div>
    </section>
  );
}

export default PartnersAndClientsSection;
