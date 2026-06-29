import { TenantLandingResponse } from "@/types/tenant.types";
import SocialCard from "./SocialCard";

export default function Followers({
  followers,
}: {
  followers: TenantLandingResponse["data"]["social"];
}) {
  if (!followers?.items?.length) return null;

  return (
    <section className="flex flex-col items-center gap-2">
      <h2 className="md:text-32 text-center text-[20px] font-bold text-black">
        {followers?.section_title}
      </h2>

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center justify-items-center gap-4">
        {followers?.items?.map((card, index) => {
          return <SocialCard key={index} card={card} />;
        })}
      </div>
    </section>
  );
}
