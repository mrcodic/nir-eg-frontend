import { IUser } from "@/types";
import CoursePhoneVerifyCard from "./CoursePhoneVerifyCard";
import CourseProgressCard from "./CourseProgressCard";
import PaymentCom from "./PaymentCom";

function CourseFloatingCards({
  data,
  SingleCourse,
  profile,
}: {
  data: any;
  SingleCourse: any;
  profile: IUser | null;
}) {
  if (data?.body?.is_subscriped && !data?.body?.parent_phone_verification)
    return <CoursePhoneVerifyCard parentPhone={data?.body?.parent_phone} />;

  if (data?.body?.is_subscriped && data?.body?.parent_phone_verification)
    return <CourseProgressCard progress={data?.body?.progress || 0} />;

  if (!data?.body?.is_subscriped && data?.body?.subscription_type !== "حصة")
    return (
      <PaymentCom
        courseId={SingleCourse}
        bundleId={data?.body?.bundle_id}
        isCodeCenter={profile && profile?.type == 5}
        price={data?.body?.classroom_price}
        sale={data?.body?.sale}
        hasCoupon={data?.body?.has_promocode}
      />
    );
}

export default CourseFloatingCards;
