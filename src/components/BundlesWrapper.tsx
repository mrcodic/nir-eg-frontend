"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { getClientPrivateData, getPublicData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { PaymentModel } from "./modals/PaymentModel";
import RoomHeader from "./RoomHeader";
import { Button } from "./ui/button";
import DataWithLabel from "./ui/DataWithLabel";
import PriceBubbles from "./ui/price-bubble";

const BundlesWrapper = () => {
  const modal = useModal();

  const searchParams = useSearchParams();
  const router = useRouter();

  const { profile, isLoading } = useAuthContext();

  let api = "";

  if (profile) {
    api = "/students/bundles";
  } else {
    api = `/guest/bundels?grade_id=${searchParams.get("grade")}`;
  }

  const { data, isLoading: isLoadingBundles } = useQuery({
    queryKey: [api],
    queryFn: profile ? getClientPrivateData : getPublicData,
    gcTime: 0,
    enabled: !isLoading && profile?.type !== 5,
  });

  const bundlesData = profile ? data?.body?.budles : data?.body;

  if (!bundlesData?.length || isLoadingBundles) return null;

  return (
    <div className="wrapper">
      <RoomHeader
        className="mb-6 items-start"
        title="الباقات"
        icon="/assets/books-colored.svg"
        subText="أحدث الباقات المضافة"
      />

      <div className="mt-8 flex max-h-[600px] flex-col gap-6 overflow-y-auto">
        {bundlesData?.map((bundle, index) => {
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
                  {!bundle.is_subscribed && (
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

                  {bundle.is_subscribed === true && (
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
    </div>
  );
};

export default BundlesWrapper;
