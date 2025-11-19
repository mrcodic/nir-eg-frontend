import React from "react";
import CourseForm from "../forms/CourseForm";
import BundleForm from "../forms/bundleForm";
import RoomPayForm from "../forms/RoomPayForm";
import { getData } from "@/utils/api";
import PaymentCenterCode from "../forms/PaymentCenterCode";

export default async function PayModel({
  data,
  courseId,
  bundleId,
  roomId,
  centerId,
}) {
  const profile = await getData({
    queryKey: ["/students/profile"],
  });

  const isCenterCode = profile?.body?.type === 5;

  if (courseId && !isCenterCode) {
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
    return <BundleForm bundleId={bundleId} data={data} />;
  } else if (roomId) {
    return <RoomPayForm roomId={roomId} centerId={centerId} data={data} />;
  }
}
