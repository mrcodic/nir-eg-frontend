"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/Loading";
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
    if (!data && !isLoading) {
      router.push("/ErrorPage");
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen">
        {" "}
        <LoadingSpinner />{" "}
      </div>
    );
  } else {
    if (!data) {
      <div className="h-screen">
        {" "}
        <Empty text={" لا يوجد بيانات "} />{" "}
      </div>;
    }

    if (!subscribed)
      return (
        <div className="h-screen">
          {" "}
          <Empty text={text || " انت غير مشترك في هذا الكورس  "} />{" "}
        </div>
      );
    if (!verify) return <ReachModal open={true} setOpen={() => {}} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
