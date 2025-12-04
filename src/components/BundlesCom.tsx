"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { getClientPrivateData, getPublicData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { PaymentModel } from "./modals/PaymentModel";
import RoomHeader from "./RoomHeader";
import { Button } from "./ui/button";
import DataWithLabel from "./ui/DataWithLabel";
import PriceBubbles from "./ui/price-bubble";

const BundlesCom = () => {
  const modal = useModal();

  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState(0);
  const router = useRouter();

  const { profile, isLoading } = useAuthContext();
  const [BundlesData, setBundlesData] = useState([]);

  let api = "";
  if (profile) {
    api = "/students/bundles";
  } else {
    api = `/guest/bundels?grade_id=${searchParams.get("grade")}`;
  }

  const { data, isLoading: bundlesLoading } = useQuery({
    queryKey: [api],
    queryFn: profile ? getClientPrivateData : getPublicData,
    gcTime: 0,
    enabled: !isLoading && profile?.type !== 5,
    // suspense: true,
  });

  useEffect(() => {
    if (profile && !BundlesData) {
      setBundlesData(data?.body?.budles);
    } else {
      setBundlesData(data?.body);
    }
  }, [profile, BundlesData, data]);

  console.log("bundles query data : ", api, data);

  if (!BundlesData?.length) return null;

  return (
    <div className="wrapper">
      <RoomHeader
        className="mb-6 items-start"
        title="الباقات"
        icon="/assets/books-colored.svg"
        subText="أحدث الباقات المضافة"
      />

      <div className="flex flex-col gap-6 mt-8 max-h-[600px] overflow-y-auto">
        {BundlesData?.map((bundle, index) => {
          return (
            <div
              key={index}
              className="flex flex-col mobile:flex-row mobile:gap-6"
            >
              <div className=" w-full max-h-[270px] mobile:w-[270px] aspect-square bg-background rounded-lg overflow-hidden relative max-mobile:mx-auto">
                <Image
                  className=" object-contain "
                  src={bundle?.cover || "/assets/grade-placeholder.png"}
                  fill
                  alt="bundle cover image"
                />
              </div>

              <div className={`flex-1 border rounded-lg p-4 `}>
                <div className="flex w-full items-center justify-between gap-6 border-b border-gray-light pb-3">
                  <h2 className=" text-sm mobile:text-2xl font-bold">
                    {bundle.name}
                  </h2>

                  <PriceBubbles price={bundle.price} sale={bundle.sale} />
                </div>

                <div className="flex flex-col  mobile:text-base gap-1  mobile:gap-2 mt-4">
                  <h3 className="text-gray-dark text-sm ">
                    تحتوي الباقة على التالي:
                  </h3>

                  <span className=" inline-block font-bold">
                    {bundle.classrooms
                      .map((classroom) => classroom.title)
                      .join(" و ")}
                  </span>
                </div>

                <div className="flex gap-2 items-center mt-4 pb-2 border-b border-gray-light">
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

                <div className="flex justify-between items-center flex-wrap gap-4 mt-6">
                  {!bundle.is_subscribed && (
                    <div className="flex w-full gap-x-6 gap-y-4 text-sm font-bold flex-wrap">
                      <Button
                        onClick={() => {
                          setSelectedId(bundle.id);
                          if (profile) {
                            modal.setDialogContent(
                              <PaymentModel
                                bundleId={selectedId.toString()}
                                price={bundle.price}
                              />
                            );
                            modal.openModal();
                          } else {
                            router.push("/register?redirect=/bundles");
                          }
                        }}
                        className="max-w-[171px] w-full"
                      >
                        اشترك الآن
                      </Button>

                      <Button
                        onClick={() => {
                          router.push(`/bundles/showBundle?type=${bundle.id}`);
                        }}
                        variant="secondary"
                        className="max-w-[171px] w-full"
                      >
                        عرض الباقة
                      </Button>
                    </div>
                  )}

                  {bundle.is_subscribed === true && (
                    <div className="w-[116px] rounded-lg flex items-center justify-center py-1 mt-6 text-white border border-[#9D8242] bg-primary text-sm font-bold">
                      مشترك
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* <PaymentModel
          open={isSubscribeNow}
          setOpen={setIsSubscribeNow}
          bundleId={selectedId}
          price={BundlesData?.price || BundlesData?.latest_room?.price}
        /> */}
      </div>
    </div>
  );
};

export default BundlesCom;
