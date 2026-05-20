"use client";

import { PaymentModel } from "@/components/modals/PaymentModel";
import { Button } from "@/components/ui/button";
import DataWithLabel from "@/components/ui/DataWithLabel";
import PriceBubbles from "@/components/ui/price-bubble";
import { useModal } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";
import { Bundle, IUser } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BundleCard({
  bundle,
  profile,
  isMultiGrid,
}: {
  bundle: Bundle;
  profile: IUser;
  isMultiGrid?: boolean;
}) {
  const router = useRouter();
  const modal = useModal();

  return (
    <div
      className={cn("mobile:flex-row flex flex-col gap-6", {
        "xl:flex-col 2xl:flex-row": isMultiGrid,
      })}
    >
      <div className="mobile:w-[270px] bg-background max-mobile:mx-auto relative aspect-square max-h-[270px] w-full overflow-hidden rounded-lg">
        <Image
          className="object-contain"
          src={bundle?.cover || "/assets/grade-placeholder.png"}
          fill
          alt="bundle cover image"
          fetchPriority="high"
          loading="eager"
        />
      </div>

      <div className={`flex flex-1 flex-col rounded-lg border p-4`}>
        <div className="border-gray-light flex w-full items-center justify-between gap-6 border-b pb-3">
          <h2 className="mobile:text-2xl text-sm font-bold">{bundle.name}</h2>

          <PriceBubbles price={bundle.price} sale={bundle.sale} />
        </div>

        <div className="mobile:text-base mobile:gap-2 mt-4 flex flex-col gap-1">
          <h3 className="text-gray-dark text-sm">تحتوي الباقة على التالي:</h3>

          <span className="inline-block font-bold">
            {bundle.classrooms.map((classroom) => classroom.title).join(" و ")}
          </span>
        </div>

        <div className="border-gray-light mt-4 mb-auto flex items-center gap-2 border-b pb-2">
          <Image
            className=""
            width={24}
            height={24}
            alt="calendar icon"
            src="/assets/calendar.svg"
          />

          <DataWithLabel
            className="gap-1"
            label="تاريخ الاضافة"
            data={new Date(bundle?.created_at).toISOString().split("T")[0]}
            labelClassName="text-xs text-gray-dark"
            dataClassName="text-sm"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {!bundle?.is_subscribed && (
            <div className="flex w-full flex-wrap gap-x-6 gap-y-4 text-sm font-bold">
              <Button
                onClick={() => {
                  if (profile) {
                    modal.setDialogContent(
                      <PaymentModel
                        bundleId={bundle.id.toString()}
                        price={bundle.price}
                      />,
                    );
                    modal.openModal();
                  } else {
                    router.push(
                      `/login?redirect=/bundles/bundle-details/${bundle.id}`,
                    );
                  }
                }}
                className="w-full max-w-[171px]"
              >
                اشترك الآن
              </Button>

              <Button
                onClick={() => {
                  router.push(`/bundles/bundle-details/${bundle.id}`);
                }}
                variant="secondary"
                className="w-full max-w-[171px]"
              >
                عرض الباقة
              </Button>
            </div>
          )}

          {bundle?.is_subscribed === true && (
            <div className="bg-primary mt-6 flex w-[116px] items-center justify-center rounded-lg border border-[#9D8242] py-1 text-sm font-bold text-white">
              مشترك
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
