"use client";

import { PaymentModel } from "@/components/modals/PaymentModel";
import PaginationComponent from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import DataWithLabel from "@/components/ui/DataWithLabel";
import PriceBubbles from "@/components/ui/price-bubble";
import { useModal } from "@/context/ModalProvider";
import { getClientData, getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { Bundle, Grade, IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

const ITEMS_PER_PAGE = 4;

const BundlesWrapper = ({ profile }: { profile: IUser | null }) => {
  const modal = useModal();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(1);

  let api = "";

  if (profile) {
    api = "/students/bundles";
  } else {
    api = `/guest/bundels?grade_id=${searchParams.get("grade") || 1}`;
  }

  const { data, isLoading: isLoadingBundles } = useQuery<{
    body:
      | {
          budles: Bundle[];
          grade: Grade;
        }
      | Bundle[];
  }>({
    queryKey: [api],
    queryFn: profile ? getClientPrivateData : getClientData,
    gcTime: 0,
    enabled: profile?.type !== 5,
  });

  const bundlesData = profile
    ? (data?.body as { budles: Bundle[] })?.budles
    : (data?.body as Bundle[]);

  const displayedBundles = bundlesData?.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  if (!bundlesData?.length || isLoadingBundles) return null;

  return (
    <div className="wrapper">
      <RoomHeader
        className="mb-6 items-start"
        title="الباقات"
        icon="/assets/books-colored.svg"
        subText="أحدث الباقات المضافة"
      />

      <div
        className={cn("mt-8 grid gap-6", {
          "xl:grid-cols-2 xl:gap-10": displayedBundles?.length > 1,
        })}
      >
        {displayedBundles?.map((bundle, index) => {
          return (
            <div
              key={index}
              className="mobile:flex-row mobile:gap-6 flex flex-col"
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

              <div className={`flex-1 rounded-lg border p-4`}>
                <div className="border-gray-light flex w-full items-center justify-between gap-6 border-b pb-3">
                  <h2 className="mobile:text-2xl text-sm font-bold">
                    {bundle.name}
                  </h2>

                  <PriceBubbles price={bundle.price} sale={bundle.sale} />
                </div>

                <div className="mobile:text-base mobile:gap-2 mt-4 flex flex-col gap-1">
                  <h3 className="text-gray-dark text-sm">
                    تحتوي الباقة على التالي:
                  </h3>

                  <span className="inline-block font-bold">
                    {bundle.classrooms
                      .map((classroom) => classroom.title)
                      .join(" و ")}
                  </span>
                </div>

                <div className="border-gray-light mt-4 flex items-center gap-2 border-b pb-2">
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
                    data={
                      new Date(bundle?.created_at).toISOString().split("T")[0]
                    }
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
                              `/register?redirect=/bundles/showBundle?bundleId=${bundle.id}`,
                            );
                          }
                        }}
                        className="w-full max-w-[171px]"
                      >
                        اشترك الآن
                      </Button>

                      <Button
                        onClick={() => {
                          router.push(
                            `/bundles/showBundle?bundleId=${bundle.id}`,
                          );
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
        })}
      </div>

      {bundlesData?.length > ITEMS_PER_PAGE && (
        <PaginationComponent
          className="w-full"
          currentPage={page}
          total={bundlesData?.length}
          setPage={setPage}
          pageSize={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default BundlesWrapper;
