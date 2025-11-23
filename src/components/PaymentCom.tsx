"use client";

import { usePayment } from "@/hooks/usePayment";
import { CourseType } from "@/types";
import { PaymentUI } from "./ui/PaymentUI";

// interface PaymentComProps {
//   courseId?: string;
//   bundleId?: string;
//   isCodeCenter?: boolean;
// }

const PaymentCom = ({
  courseId,
  bundleId,
  isCodeCenter,
  price,
  sale,
  hasCoupon,
}: {
  courseId?: string;
  bundleId?: string;
  isCodeCenter?: boolean;
  price?: number;
  sale?: CourseType["sale"];
  hasCoupon?: boolean;
}) => {
  const {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleNextClick,
    coupon,
    setCoupon,
    isLoadingMethods,
  } = usePayment({ courseId, bundleId, isCodeCenter, asModal: false });

  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20) ",
      }}
      className="bg-[#F9FAFC] relative md:text-[24px] font-bold  flex flex-col max-w-[min(760px,85%)] w-full justify-center md:w-[760px]  border py-3 md:py-[32px] mx-auto  -mt-8 px-[20px] border-[#012D5A] rounded-lg"
    >
      <PaymentUI
        paymentMethodValue={paymentMethodValue}
        setPaymentMethodValue={setPaymentMethodValue}
        loading={loading}
        paymentTypes={paymentTypes}
        price={price}
        sale={sale}
        coupon={coupon}
        setCoupon={setCoupon}
        courseId={courseId}
        hasCoupon={hasCoupon}
        isLoadingMethods={isLoadingMethods}
      />
      {paymentTypes.length > 0 && (
        <div className="flex flex-row! justify-between gap-5 mt-5 mx-auto">
          <div
            onClick={handleNextClick}
            className="bg-primary cursor-pointer text-center border border-gray-light rounded-lg w-[148px] text-sm font-bold p-2 text-white"
          >
            التالي
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCom;
