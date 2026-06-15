import { Animate } from "@/components/shared/Animate";
import CustomImage from "@/components/ui/CustomImage";
import DataWithLabel from "@/components/ui/DataWithLabel";
import PriceBubbles from "@/components/ui/price-bubble";
import { Bundle } from "@/types";
import type { Variants } from "framer-motion";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.05,
    },
  },
};

const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const detailsVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 48,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

function BundleDetailsCard({
  bundle,
  showPrice,
}: {
  bundle: Bundle;
  showPrice?: boolean;
}) {
  return (
    <Animate
      className="flex gap-6 overflow-hidden max-md:flex-col"
      preset="none"
      variants={containerVariants}
      trigger="mount"
    >
      <Animate
        isChild
        variants={imageVariants}
        className="border-gray-light relative aspect-square max-h-58 min-w-46 overflow-hidden rounded-lg border"
      >
        <CustomImage
          src={bundle?.cover}
          fallback="/assets/grade-placeholder.png"
          alt="bundle image"
          className="object-cover"
          fetchPriority="high"
          loading="eager"
          fill
        />
      </Animate>

      <Animate
        isChild
        variants={detailsVariants}
        className="border-gray-light grow rounded-lg border p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-2xl font-bold">{bundle?.name}</h4>

          {showPrice && <PriceBubbles price={bundle?.price} />}
        </div>

        <hr className="bg-gray-light my-3 h-px w-full" />

        <div className="space-y-2">
          <h4 className="text-gray-dark text-sm font-bold">
            تحتوي الباقة على التالي:
          </h4>

          <p className="text-base font-bold">
            {bundle.classrooms.map((classroom) => classroom.title).join(" و ")}
          </p>
        </div>

        <div className="mt-4">
          <DataWithLabel
            className="gap-1"
            label="تاريخ الاضافة"
            data={bundle?.created_at?.split("T")?.[0]}
            labelClassName="text-xs text-gray-dark"
            dataClassName="text-sm"
            icon={
              <Image
                src="/assets/calendar.svg"
                width={20}
                height={20}
                alt="calendar icon"
              />
            }
          />
        </div>
      </Animate>
    </Animate>
  );
}

export default BundleDetailsCard;
