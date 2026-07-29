import { TenantLandingResponse } from "@/types/tenant.types";
import UnderlineStyle from "../shared/UnderlineStyle";
import { Card, CardContent, CardHeader } from "../ui/card";
import CustomImage from "../ui/CustomImage";

function WhyChooseUs({
  content,
}: {
  content: TenantLandingResponse["data"]["why"];
}) {
  if (!content?.items?.length) return null;

  return (
    <section className="space-y-8">
      <div className="flex justify-center">
        <h3 className="text-32 mx-auto font-bold">
          {/* ليه تختار <StyledText text="نير ؟ " /> */}
          {content?.section_title}
        </h3>
      </div>

      <div className="grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {content?.items?.map((card, i) => (
          <Card
            key={card?.title || i}
            className="hover:border-secondary hover:bg-background flex w-full flex-col transition-all max-sm:max-w-[450px]"
          >
            <CardHeader className="mb-6 items-center pb-0">
              <CustomImage
                src={card?.image}
                fallback="/assets/gifs/stars.gif"
                width={56}
                height={56}
                alt="icon"
                className="size-14 object-contain"
              />
            </CardHeader>
            <CardContent className="p-4 pt-0 text-center">
              <UnderlineStyle
                isActive
                className="mx-auto mt-auto w-fit text-center"
              >
                <h3 className="text-primary-800 text-lg font-bold">
                  {card?.title}
                </h3>
              </UnderlineStyle>

              <p className="mt-3 font-bold">{card?.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
