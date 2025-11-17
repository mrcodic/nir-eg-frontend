// app/components/content-protection.tsx
import Image from "next/image";

const items = [
  {
    id: 1,
    text: "لا يمكن للطلاب تسجيل فيديوهات الدروس.",
    color: "bg-semantics-red",
    Icon: "/assets/close-fill.svg",
  },
  {
    id: 2,
    text: "نحرص على أمان بياناتك و ضمان خصوصيتك أثناء استخدام المنصة لنقل تعليمك بكل أمان.",
    color: "bg-semantics-green",
    Icon: "/assets/shield-fill.svg",
  },
  {
    id: 3,
    text: "سيقوم الطلاب بمشاهدة الفيديوهات من خلال التطبيق الخاص بنا.",
    color: "bg-primary-800",
    Icon: "/assets/play-fill.svg",
  },
];

export default function ContentProtectionSection() {
  return (
    <section className="wrapper w-full relative text-center pb-12 space-y-6">
      <div className=" flex max-w-7xl mx-auto flex-col items-center gap-8 gap-x-16 md:flex-row md:items-center">
        {/* Right text block */}
        <div className="w-full md:w-2/3 text-right">
          {/* Title + emoji */}
          <div className="mb-6 flex items-center  gap-2">
            <h2 className="text-xl font-bold md:text-3xl">
              تقنية عالية في حماية المحتوى من السرقة
            </h2>
            <Image
              src="/assets/lock.svg"
              width="50"
              height="50"
              alt="lock icon"
            />
          </div>

          {/* Description items */}
          <ul className="space-y-6 text-sm md:text-base">
            {items.map(({ id, text, color, Icon }) => (
              <li key={id} className="flex items-center justify-start gap-3">
                {/* Icon badge */}
                <span
                  className={`flex shrink-0 size-12 items-center justify-center rounded-lg text-white shadow ${color}`}
                >
                  <Image src={Icon} width="32" height="32" alt="icon" />
                </span>

                {/* Text */}
                <p className="font-bold text-xl">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Left image block */}

        <div className="w-full md:w-1/3">
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg bg-dark-radial lg:width-[367px]">
            {/* replace /locks.png with your image path */}
            <Image
              src="/assets/protect.svg"
              alt="قفل المحتوى"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
