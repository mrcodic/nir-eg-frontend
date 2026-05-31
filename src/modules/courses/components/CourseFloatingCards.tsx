import PaymentCom from "@/modules/payment/components/PaymentCom";
import { IUser } from "@/types";
import CourseProgressCard from "./CourseProgressCard";

function CourseFloatingCards({
  data,
  classroomId,
  profile,
}: {
  data: any;
  classroomId: any;
  profile: IUser | null;
}) {
  // if (data?.body?.is_subscriped && !profile?.parent_phone_verification)
  //   return <CoursePhoneVerifyCard parentPhone={profile?.parent_phone} />;

  if (data?.body?.is_subscriped && (profile?.parent_phone_verification || true))
    return <CourseProgressCard progress={data?.body?.progress || 0} />;

  if (!data?.body?.is_subscriped && data?.body?.subscription_type !== "حصة")
    return (
      <PaymentCom
        courseId={classroomId}
        bundleId={data?.body?.bundle_id}
        isCodeCenter={profile && profile?.type == 5}
        price={data?.body?.classroom_price}
        sale={data?.body?.sale}
        hasCoupon={data?.body?.has_promocode}
      />
    );
}

export default CourseFloatingCards;
