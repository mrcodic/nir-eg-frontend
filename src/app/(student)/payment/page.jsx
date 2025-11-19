import PayLabel from "@/components/PayLabel";
import PayComp from "@/components/paymentTypes/PayComp";
import PayModel from "@/components/paymentTypes/PayModel";
import { getData } from "@/utils/api";

const page = async ({ searchParams }) => {
  const { courseId, bundleId, roomId, centerId, type } = await searchParams;

  let data;

  if (courseId) {
    const response = await getData({
      queryKey: [`/students/courses/${courseId}`],
    });
    data = response.data;
  } else if (bundleId) {
    data = await getData({
      queryKey: [`/bundles/${bundleId}`],
    });
  } else if (roomId) {
    data = await getData({
      queryKey: [`students/get-lessons/${roomId}`],
    });
  }
  // else if (roomId) {
  //   return <RoomPayForm roomId={roomId} centerId={centerId} />;
  // }

  return (
    <>
      <div
        className="mb-[48px] bg-[url(/assets/moreenglish.svg),url(/assets/Group-15.svg)] bg-no-repeat md:mx-20  mt-[100px]"
        style={{ backgroundPosition: "top right , top left" }}
      >
        <div>
          <h2 className="text-[20px] mb-10 pt-[70px] mr-[50px] whitespace-nowrap font-bold">
            شراء الباقة
          </h2>
        </div>
        <div className="lg:w-[50%] flex flex-col justify-center mx-auto p-3  bg-no-repeat bg-left ">
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
    </>
  );
};
export default page;
