import { getServerData } from "@/helpers/server-fetch";
import PayLabel from "@/modules/payment/components/PayLabel";
import PaymentDetailsRenderer from "@/modules/payment/components/PaymentDetailsRenderer";

const page = async ({ searchParams }) => {
  const { courseId, bundleId, roomId, centerId, type } = await searchParams;

  let data;

  if (courseId) {
    const response = await getServerData({
      queryKey: [`/students/courses/${courseId}`],
    });
    data = response.data;
  } else if (bundleId) {
    data = await getServerData({
      queryKey: [`/bundles/${bundleId}`],
    });
  } else if (roomId) {
    data = await getServerData({
      queryKey: [
        `/students/get-lessons/${roomId}?classroom_id=${courseId || centerId}`,
      ],
    });
  }

  // used only for payment with code for now
  // other payment methods use payment gateway

  return (
    <div className="wrapper mt-20 mb-12 pt-22">
      <h2 className="text-28 mb-10 font-bold whitespace-nowrap">شراء الباقة</h2>

      <div className="flex flex-col justify-center">
        <div className="flex-1 font-bold">
          <PayLabel type={type} price={data?.price} />

          <PaymentDetailsRenderer
            data={data}
            courseId={courseId}
            bundleId={bundleId}
            roomId={roomId}
            centerId={centerId}
          />
        </div>
      </div>
    </div>
  );
};
export default page;
