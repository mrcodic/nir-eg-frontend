"use client";

import ExpiredOrInvalid from "@/modules/parent-portal/components/ExpiredOrInvalid";
import { useSearchParams } from "next/navigation";

function PortalError({ error }: { error: Error }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // console.log("error : ", error);

  return (
    <div className="w-[85%] mx-auto my-10 ">
      <ExpiredOrInvalid token={token} />
    </div>
  );
}

export default PortalError;
