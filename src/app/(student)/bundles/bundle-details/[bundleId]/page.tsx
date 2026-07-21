import { Animate } from "@/components/shared/Animate";
import Empty from "@/components/shared/Empty";
import PriceBubbles from "@/components/ui/price-bubble";
import RemainingDuration from "@/components/ui/RemainingDuration";
import StyledText from "@/components/ui/StyledText";
import SubbedBadge from "@/components/ui/SubbedBadge";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import { formatCurrency } from "@/lib/utils";
import BundleDetailsCard from "@/modules/bundles/components/BundleDetailsCard";
import BundlePurchaseButton from "@/modules/bundles/components/BundlePurchaseButton";
import CourseCard from "@/modules/courses/components/CourseCard";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { ApiResponse, Bundle, IUser } from "@/types";
import { Variants } from "framer-motion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل الباقة",
  description:
    "اطلع على تفاصيل الباقة التعليمية ومحتواها وخيارات الاشتراك الخاصة بها.",
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      staggerChildren: 0.08,
      ease: "easeOut",
    },
  },
};

const BundleDetails = async ({
  params,
}: {
  params: Promise<{ bundleId?: string }>;
}) => {
  const pageParams = await params;
  const bundleId = pageParams.bundleId;

  const profileData = await getServerData<ApiResponse<IUser | null>>({
    queryKey: [`/students/profile`],
  });

  const profile = profileData?.body;

  if (!bundleId) {
    return <Empty isPageError text="لم يتم العثور على هذه الباقة" />;
  }

  const data = await getServerData<{ body: Bundle }>({
    queryKey: [`/bundles/${bundleId}`],
    isAuth: !!profile,
  });

  if (!data) {
    return <Empty isPageError text="لم يتم العثور على هذه الباقة" />;
  }

  const classroomsPrice = data?.body.courses.reduce((acc, classroom) => {
    return acc + Number(classroom.price);
  }, 0);

  const bundle = data?.body;
  const savedAmount = Math.max(
    Number(classroomsPrice) - Number(bundle?.price || 0),
    0,
  );
  const isSubbed = bundle?.is_subscribed;

  return (
    <div className="wrapper mt-[140px] mb-22">
      <RoomHeader
        width={"w-auto"}
        height={"h-auto"}
        icon={"/assets/books-colored.svg"}
        title={"محتويات الباقة"}
      />
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-32 font-bold">{bundle?.name}</h2>

          <div className="ms-auto flex grow flex-col items-end gap-3">
            {isSubbed ? (
              <SubbedBadge />
            ) : (
              <div className="flex w-full flex-wrap justify-end gap-3">
                <BundlePurchaseButton
                  profile={profile}
                  bundle={bundle}
                  className="ms-auto h-9 w-full max-w-24"
                />

                <PriceBubbles
                  price={bundle?.price}
                  sale={bundle?.sale}
                  className="ms-0 w-fit"
                  numberClassName="text-lg"
                  currencyClassName="text-base mt-auto "
                />
              </div>
            )}

            {!isSubbed && bundle?.sale?.duration && (
              <RemainingDuration
                duration={`${bundle?.sale?.duration} ايام`}
                text="الخصم متاح لمدة"
              />
            )}
          </div>
        </div>

        <hr className="bg-gray-light my-4 h-px w-full" />

        <BundleDetailsCard bundle={bundle} />

        <h5 className="mt-10 text-2xl font-bold">تحتوى الباقة على </h5>

        <Animate
          variants={containerVariants}
          className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {bundle?.classrooms.map((classroom) => (
            <CourseCard
              key={classroom.id}
              isBundles={true}
              courseDetails={classroom}
              isSubbed={isSubbed || classroom?.isSubscribed}
              cardItemVariants={itemVariants}
            />
          ))}
        </Animate>

        {!isSubbed && !!savedAmount && (
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

            <BundlePurchaseButton profile={profile} bundle={bundle} />
          </div>
        )}
      </div>
    </div>
  );
};
export default BundleDetails;
