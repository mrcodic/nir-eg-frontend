import PaymentCenterCode from "@/components/forms/PaymentCenterCode";
import { getServerData } from "@/helpers/server-fetch";
import RoomPayment from "@/modules/payment/components/RoomPayment";

export default async function PaymentDetailsRenderer({
  data,
  courseId,
  bundleId,
  roomId,
}) {
  const profile = await getServerData({
    queryKey: ["/students/profile"],
  });

  const isCenterCode = profile?.body?.type === 5;

  // if (courseId && !isCenterCode) {
  //   // doesnt trigger
  //   return <CourseForm courseId={courseId} data={data} />;
  // } else
  if ((roomId || courseId) && isCenterCode) {
    return (
      <PaymentCenterCode
        courseId={courseId}
        roomId={roomId}
        data={data?.body?.room || data}
      />
    );
    // } else if (bundleId) {
    //   return <BundleForm bundleId={bundleId} data={data} />;
  } else if (roomId) {
    return <RoomPayment roomId={roomId} courseId={courseId} data={data} />;
  }
}
