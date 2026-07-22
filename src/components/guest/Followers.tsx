import { TenantLandingResponse } from "@/types/tenant.types";
import SectionTitle from "./SectionTitle";
import SocialCard from "./SocialCard";

export default function Followers({
  followers,
}: {
  followers: TenantLandingResponse["data"]["social"];
}) {
  if (!followers?.items?.length) return null;

  return (
    <section className="flex flex-col items-center gap-2">
      <SectionTitle title={followers?.section_title} />

      <div className="mt-8 grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center justify-items-center gap-4">
        {followers?.items?.map((card, index) => {
          return <SocialCard key={index} card={card} />;
        })}
      </div>
    </section>
  );
}
