import { Bundle } from "@/types";
import Image from "next/image";
import DataWithLabel from "./ui/DataWithLabel";
import PriceBubbles from "./ui/price-bubble";

function BundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <div className="flex gap-6 max-md:flex-col">
      <div className="relative min-w-46 max-h-58 aspect-square border border-gray-light rounded-lg overflow-hidden ">
        <Image
          src={bundle?.cover || "/assets/grade-placeholder.png"}
          fill
          alt="bundle image"
          className="object-contain"
        />
      </div>

      <div className="rounded-lg border grow border-gray-light p-4">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-2xl font-bold">{bundle?.name}</h4>

          <PriceBubbles
            price={bundle?.price}
            sale={bundle?.sale}
            numberClassName="text-xl"
            currencyClassName="text-base mt-auto"
          />
        </div>

        <hr className="bg-gray-light h-px w-full my-3" />

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-dark">
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
