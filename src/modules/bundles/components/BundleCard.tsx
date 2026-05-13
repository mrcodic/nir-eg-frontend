import { Bundle } from "@/types";
import Image from "next/image";
import DataWithLabel from "@/components/ui/DataWithLabel";

function BundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <div className="flex gap-6 max-md:flex-col">
      <div className="border-gray-light relative aspect-square max-h-58 min-w-46 overflow-hidden rounded-lg border">
        <Image
          src={bundle?.cover || "/assets/grade-placeholder.png"}
          fill
          alt="bundle image"
          className="object-contain"
          fetchPriority="high"
          loading="eager"
        />
      </div>

      <div className="border-gray-light grow rounded-lg border p-4">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-2xl font-bold">{bundle?.name}</h4>

          {/* <PriceBubbles
            price={bundle?.price}
            sale={bundle?.sale}
            numberClassName="text-xl"
            currencyClassName="text-base mt-auto"
          /> */}
        </div>

        <hr className="bg-gray-light my-3 h-px w-full" />

        <div className="space-y-2">
          <h4 className="text-gray-dark text-sm font-bold">
            تحتوي الباقة على التالي:
          </h4>
          <p className="text-base font-bold">
            {bundle.classrooms.map((classroom) => classroom.title).join("و ")}
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
      </div>
    </div>
  );
}

export default BundleCard;
