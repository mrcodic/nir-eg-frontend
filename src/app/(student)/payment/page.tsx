import PayLabel from "@/components/PayLabel";
import PayComp from "@/components/paymentTypes/PayComp";
import PayModel from "@/components/paymentTypes/PayModel";
import { getServerPrivateData } from "@/helpers/server-fetch";

const page = async ({ searchParams }) => {
  const { courseId, bundleId, roomId, centerId, type } = await searchParams;

  let data;

  if (courseId) {
    const response = await getServerPrivateData({
      queryKey: [`/students/courses/${courseId}`],
    });
    data = response.data;
  } else if (bundleId) {
    data = await getServerPrivateData({
      queryKey: [`/bundles/${bundleId}`],
    });
  } else if (roomId) {
    data = await getServerPrivateData({
      queryKey: [`/students/get-lessons/${roomId}`],
    });
  }

  return (
    <div className="mb-12  wrapper  mt-20 pt-22">
      <h2 className="text-28 mb-10  whitespace-nowrap font-bold">
        شراء الباقة
      </h2>

      <div className="flex flex-col justify-center ">
        <div className="flex-1  font-bold ">
          <PayLabel type={type} price={data?.price} />

          <PayModel
            data={data}
            courseId={courseId}
            bundleId={bundleId}
            roomId={roomId}
            centerId={centerId}
          />
        </div>

        <PayComp type={type} data={data} />
      </div>
    </div>
  );
};
export default page;
