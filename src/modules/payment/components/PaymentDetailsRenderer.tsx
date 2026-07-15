import PaymentBundlesForm from "@/components/forms/PaymentBundlesForm";
import PaymentCenterCode from "@/components/forms/PaymentCenterCode";
import { getServerData } from "@/helpers/fetchers/server-fetch";
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

  if ((roomId || courseId) && isCenterCode) {
    return (
      <PaymentCenterCode
        courseId={courseId}
        roomId={roomId}
        data={data?.body?.room || data}
      />
    );
  } else if (bundleId) {
    return <PaymentBundlesForm bundleId={bundleId} data={data?.body} />;
  } else if (roomId) {
    return (
      <RoomPayment roomId={roomId} courseId={courseId} data={data?.body} />
    );
  }
}
