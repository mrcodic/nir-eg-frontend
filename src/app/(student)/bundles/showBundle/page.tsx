"use client";
import BundleCard from "@/components/BundleCard";
import CourseCard from "@/components/CourseCard";
import CustomLoader from "@/components/custom/Loader";
import { PaymentModel } from "@/components/modals/PaymentModel";
import RoomHeader from "@/components/RoomHeader";
import { Button } from "@/components/ui/button";
import PriceBubbles from "@/components/ui/price-bubble";
import RemainingDuration from "@/components/ui/RemainingDuration";
import StyledText from "@/components/ui/StyledText";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { getClientPrivateData, getPublicData } from "@/helpers/client-fetch";
import { formatCurrency } from "@/lib/utils";
import { Bundle } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { redirect, useRouter, useSearchParams } from "next/navigation";

const ShowBundle = () => {
  const params = useSearchParams();
  const { profile } = useAuthContext();
  const router = useRouter();
  const modal = useModal();

  const bundleId = params.get("type");

  if (!bundleId) {
    return redirect("/ErrorPage?message=حدث خطأ اثناء البحث عن الباقة");
  }

  const { data, isLoading, error } = useQuery<{ body: Bundle }>({
    queryKey: [`/bundles/${bundleId}`],
    queryFn: !!profile ? getClientPrivateData : getPublicData,
  });

  if (isLoading) {
    return (
      <div className="wrapper mt-[140px]  flex items-center justify-center min-h-[min(calc(100vh-140px),768px)]">
        <CustomLoader />
      </div>
    );
  }

  if (error || (!data && !isLoading)) {
    redirect("/ErrorPage?message=حدث خطأ اثناء البحث عن الباقة");
  }

  const bundle = data?.body;

  console.log("bundle : ", bundle);

  return (
    <div className="mt-[140px] mb-22 wrapper">
      <RoomHeader
        width={"w-auto"}
        height={"h-auto"}
        icon={"/assets/books-colored.svg"}
        title={"محتويات الباقة"}
      />
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-32 font-bold">{bundle?.name}</h2>

          <div className="flex items-end gap-3 flex-col">
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

        <hr className="bg-gray-light h-px w-full my-4" />

        <BundleCard bundle={bundle} />

        <h5 className=" text-2xl font-bold mt-10">تحتوى الباقة على </h5>

        <div className="mt-6 gap-4  grid grid-cols-1  md:grid-cols-2  lg:grid-cols-3">
          {bundle?.classrooms.map((classroom) => (
            <CourseCard
              isBundles={true}
              isNewCourse={true}
              courseDetails={classroom}
            />
          ))}
        </div>

        <div className="bg-background p-4 border border-primary-800 rounded-lg mt-10 max-w-[780px] mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-xl font-bold">
            ستقوم بتوفير{" "}
            <StyledText
              className="text-32"
              text={formatCurrency(
                Number(bundle?.price) - (bundle?.sale?.discount_value || 0)
              )}
            />
            {"  "}
            اذا اشتركت فى الباقة كاملة{" "}
          </p>

          <Button
            className="max-w-43 w-full"
            onClick={() => {
              if (profile) {
                modal.setDialogContent(
                  <PaymentModel
                    bundleId={bundleId}
                    price={Number(bundle?.price)}
                    sale={bundle?.sale}
                  />
                );
                modal.openModal();
              } else {
                router.push(
                  `/login?redirect=/bundles/showBundle?type=${bundleId}`
                );
              }
            }}
          >
            اشترى الآن
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ShowBundle;
