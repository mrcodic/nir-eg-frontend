"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReachModal from "@/components/modals/ReachModal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  subscribed: boolean;
  verify: boolean;
  data: any;
  isLoading?: boolean;
  text?: string;
};

const ProtectedRoute = ({
  children,
  subscribed,
  verify,
  data,
  isLoading,
  text,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (!data && !isLoading && subscribed) {
      router.push("/ErrorPage");
    }
  }, [data, isLoading, router, subscribed]);

  if (isLoading) {
    return (
      <div className="h-screen">
        {" "}
        <LoadingSpinner />{" "}
      </div>
    );
  } else {
    if (!subscribed)
      return (
        <div className="h-screen">
          {" "}
          <Empty isError text={text || " انت غير مشترك في هذا الكورس  "} />{" "}
        </div>
      );

    if (!data) {
      <div className="h-screen">
        {" "}
        <Empty text={" لا يوجد بيانات "} />{" "}
      </div>;
    }

    if (!verify) return <ReachModal open={true} setOpen={() => {}} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
