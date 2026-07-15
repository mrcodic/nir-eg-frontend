import { getServerData } from "@/helpers/fetchers/server-fetch";
import PayLabel from "@/modules/payment/components/PayLabel";
import PaymentDetailsRenderer from "@/modules/payment/components/PaymentDetailsRenderer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الدفع",
  description: "أكمل خطوات الدفع وتابع حالة عمليات الشراء والاشتراك.",
};

const getTitle = ({ bundleId, roomId }) => {
  return bundleId ? "باقة" : roomId ? "حصة" : "كورس";
};

const page = async ({ searchParams }) => {
  const { courseId, bundleId, roomId } = await searchParams;

  let data;

  if (roomId) {
    data = await getServerData({
      queryKey: [`/students/get-lessons/${roomId}?classroom_id=${courseId}`],
    });
  } else if (courseId) {
    // code center student
    const response = await getServerData({
      queryKey: [`/students/courses/${courseId}`],
    });
    data = response?.data ?? null;
  } else if (bundleId) {
    // code center student
    data = await getServerData({
      queryKey: [`/bundles/${bundleId}`],
    });
  }

  // NOTE:
  // used only for payment with code for now
  // other payment methods use payment gateway from the model
;
  return (
    <div className="wrapper mt-20 mb-12 pt-22">
      <h2 className="text-28 mb-10 font-bold whitespace-nowrap">
        شراء {getTitle({ bundleId, roomId })}
      </h2>

      <div className="flex flex-col justify-center">
        <div className="flex-1 font-bold">
          <PayLabel
            courseId={courseId}
            bundleId={bundleId}
            roomId={roomId}
            price={data?.price || data?.body?.room?.price}
          />

          <PaymentDetailsRenderer
            data={data}
            courseId={courseId}
            bundleId={bundleId}
            roomId={roomId}
          />
        </div>
      </div>
    </div>
  );
};
export default page;
