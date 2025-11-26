"use client";

import { useBookPayment } from "../hooks/useBookPayments";
import { BooksPaymentUI } from "./BooksPaymentUI";

const BooksCartPayment = () => {
  const {
    paymentMethodValue,
    setPaymentMethodValue,
    loading,
    paymentTypes,
    handleCheckout,
    coupon,
    setCoupon,
  } = useBookPayment({ asModal: false });

  return (
    <div className=" relative md:text-2xl font-bold  flex flex-col  lg:col-span-5 col-span-12  border p-6 border-primary-800 rounded-lg ">
      <BooksPaymentUI
        paymentMethodValue={paymentMethodValue}
        setPaymentMethodValue={setPaymentMethodValue}
        loading={loading}
        paymentTypes={paymentTypes}
        coupon={coupon}
        setCoupon={setCoupon}
      />

      {paymentTypes.length > 0 && (
        <button
          onClick={handleCheckout}
          className="bg-primary cursor-pointer mt-10 text-center border border-gray-light flex items-center justify-center h-10 rounded-lg w-full text-sm font-bold p-2 text-white"
        >
          دفع
        </button>
      )}
    </div>
  );
};

export default BooksCartPayment;
