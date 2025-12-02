import { paymentType } from "@/types";
import Aman from "./Aman";
import CenterCode from "./CenterCode";
import Wallet from "./Wallet";

export default function PayComp({ type, data }) {
  switch (type) {
    case paymentType.code:
    case paymentType.visa:
      return (
        <CenterCode
          data={data}
          phoneNumber={"phoneNumber"}
          message={"message"}
        />
      );

    case paymentType.aman:
      return <Aman />;

    case paymentType.wallet:
      return <Wallet data={data} />;
  }
}
