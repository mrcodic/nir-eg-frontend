"use client";
import BundleDetailsCard from "@/modules/bundles/components/BundleDetailsCard";
import { Bundle } from "@/types";
import { useState } from "react";
import { Congrats } from "../modals/Congrats";
import CodePaymentForm from "./CodePaymentForm";

const PaymentBundlesForm = ({
  bundleId,
  data,
}: {
  bundleId: string;
  data: Bundle;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-10 w-full space-y-6">
        <BundleDetailsCard bundle={data} showPrice />

        <CodePaymentForm bundleId={bundleId} />
      </div>
      <Congrats open={open} setOpen={setOpen} />
    </>
  );
};
export default PaymentBundlesForm;
