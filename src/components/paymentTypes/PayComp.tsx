import React from "react";
import CenterCode from "./CenterCode";
import { paymentType } from "@/types";
import Aman from "./Aman";
import Wallet from "./Wallet";

export default function PayComp({ type, data }) {
  switch (type) {
    case paymentType.code:
      return (
        <CenterCode
          data={data}
          phoneNumber={"phoneNumber"}
          message={"message"}
        />
      );
    case paymentType.aman:
      return <Aman />;
    case paymentType.visa:
      return (
        <CenterCode
          data={data}
          phoneNumber={"phoneNumber"}
          message={"message"}
        />
      );
    case paymentType.wallet:
      return <Wallet data={data} />;
  }
}
