"use client";
import BundleCard from "@/components/BundleCard";
import CourseCard from "@/components/CourseCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PaymentModel } from "@/components/modals/PaymentModel";
import RoomHeader from "@/components/RoomHeader";
import { Button } from "@/components/ui/button";
import PriceBubbles from "@/components/ui/price-bubble";
import RemainingDuration from "@/components/ui/RemainingDuration";
import StyledText from "@/components/ui/StyledText";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { getClientData, getClientPrivateData } from "@/helpers/client-fetch";
import { formatCurrency } from "@/lib/utils";
import { Bundle } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const ShowBundle = () => {
  const params = useSearchParams();
  const { profile } = useAuthContext();
  const router = useRouter();
  const modal = useModal();

  const bundleId = params.get("bundleId");

  const { data, isLoading, error } = useQuery<{ body: Bundle }>({
    queryKey: [`/bundles/${bundleId}`],
    queryFn: !!profile ? getClientPrivateData : getClientData,
  });

  const classroomsPrice = useMemo(
    () =>
      data?.body.classrooms.reduce((acc, classroom) => {
        return acc + Number(classroom.price);
      }, 0),
    [data],
  );

  if (!bundleId) {
    return redirect("/ErrorPage?message=حدث خطأ اثناء البحث عن الباقة");
  }

  if (isLoading) {
    return (
      <div className="wrapper mt-[140px] flex min-h-[min(calc(100vh-140px),768px)] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || (!data && !isLoading)) {
    redirect("/ErrorPage?message=حدث خطأ اثناء البحث عن الباقة");
  }

  const bundle = data?.body;
  const savedAmount = Math.max(
    Number(classroomsPrice) - Number(bundle?.price || 0),
    0,
  );

  return (
    <div className="wrapper mt-[140px] mb-22">
      <RoomHeader
        width={"w-auto"}
        height={"h-auto"}
        icon={"/assets/books-colored.svg"}
        title={"محتويات الباقة"}
      />
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-32 font-bold">{bundle?.name}</h2>

          <div className="flex flex-col items-end gap-3">
            <PriceBubbles
              price={bundle?.price}
              sale={bundle?.sale}
              numberClassName="text-xl"
              currencyClassName="text-base mt-auto"
            />

            {bundle?.sale?.duration && (
              <RemainingDuration
                duration={`${bundle?.sale?.duration} ايام`}
                text="الخصم متاح لمدة"
              />
            )}
          </div>
        </div>

        <hr className="bg-gray-light my-4 h-px w-full" />

        <BundleCard bundle={bundle} />

        <h5 className="mt-10 text-2xl font-bold">تحتوى الباقة على </h5>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bundle?.classrooms.map((classroom) => (
            <CourseCard
              key={classroom.id}
              isBundles={true}
              isNewCourse={true}
              courseDetails={classroom}
            />
          ))}
        </div>

        {!!savedAmount && (
          <div className="bg-background border-primary-800 mx-auto mt-10 flex max-w-[780px] flex-col items-center gap-6 rounded-lg border p-4 text-center">
            <p className="text-xl font-bold">
              ستقوم بتوفير{" "}
              <StyledText
                className="text-32"
                text={formatCurrency(savedAmount)}
              />
              {"  "}
              اذا اشتركت فى الباقة كاملة{" "}
            </p>

            <Button
              className="w-full max-w-43"
              onClick={() => {
                if (profile) {
                  modal.setDialogContent(
                    <PaymentModel
                      bundleId={bundleId}
                      price={Number(bundle?.price)}
                      sale={bundle?.sale}
                    />,
                  );
                  modal.openModal();
                } else {
                  router.push(
                    `/login?redirect=/bundles/showBundle?bundleId=${bundleId}`,
                  );
                }
              }}
            >
              اشترى الآن
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ShowBundle;
