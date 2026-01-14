import { getServerData } from "@/helpers/server-fetch";
import BundleForm from "../forms/bundleForm";
import CourseForm from "../forms/CourseForm";
import PaymentCenterCode from "../forms/PaymentCenterCode";
import RoomPayForm from "../forms/RoomPayForm";

export default async function PayModel({
  data,
  courseId,
  bundleId,
  roomId,
  centerId,
}) {
  const profile = await getServerData({
    queryKey: ["/students/profile"],
  });

  const isCenterCode = profile?.body?.type === 5;

  if (courseId && !isCenterCode) {
    // doesnt trigger
    return <CourseForm courseId={courseId} data={data} />;
  } else if ((roomId || courseId) && isCenterCode) {
    return (
      <PaymentCenterCode
        courseId={courseId || centerId}
        roomId={roomId}
        data={data?.body?.room || data}
      />
    );
  } else if (bundleId) {
    // doesnt trigger
    return <BundleForm bundleId={bundleId} data={data} />;
  } else if (roomId) {
    return <RoomPayForm roomId={roomId} centerId={centerId} data={data} />;
  }
}
