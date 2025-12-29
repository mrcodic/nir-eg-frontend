import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import StyledText from "../ui/StyledText";
import UnderlineStyle from "../UnderlineStyle";

const ourFeatures = [
  {
    title: "شرح مُبسط",
    description: "فيديوهات شرح لكل مواضيع المنهج",
    icon: "/assets/bow.gif",
  },
  {
    title: "امتحانات و كويزات",
    description: "امتحانات دورية و كويز كل حصة",
    icon: "/assets/confetti.gif",
  },
  {
    title: "تقارير لولي الأمر",
    description: "تقارير دورية لولي الأمر خلال التطبيق أو واتساب",
    icon: "/assets/report.gif",
  },
  {
    title: "المتجر و الهدايا",
    description: "اجمع النقاط و استبدلها بهدايا مميزة من المتجر",
    icon: "/assets/gift.gif",
  },
  {
    title: "النقاط و الترتيب",
    description: "احصل على النقاط و ارفع ترتيبك بين زملائك",
    icon: "/assets/stars.gif",
  },
];

function WhyChooseUs() {
  return (
    <section className="space-y-8">
      <div className="flex justify-center">
        <h3 className="text-32 mx-auto font-bold">
          ليه تختار <StyledText text="نير ؟ " />
        </h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {ourFeatures.map((card) => (
          <Card
            key={card.title}
            className="hover:border-secondary hover:bg-background transition-all"
          >
            <CardHeader className="items-center gap-6 pb-2">
              <Image src={card.icon} width={56} height={56} alt="icon" />
              <UnderlineStyle isActive className="text-center">
                <h3 className="text-primary-800 text-lg font-bold whitespace-nowrap">
                  {card.title}
                </h3>
              </UnderlineStyle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-center">
              <p className="font-bold">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
