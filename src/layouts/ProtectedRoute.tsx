"use client";

import Empty from "@/components/Empty";
import LoadingSpinner from "@/components/LoadingSpinner";
import PhoneVerificationAlertModal from "@/components/modals/PhoneVerificationAlertModal";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  subscribed: boolean;
  data: any;
  isLoading?: boolean;
  text?: string;
};

const ProtectedRoute = ({
  children,
  subscribed,
  data,
  isLoading,
  text,
}: Props) => {
  const router = useRouter();
  const { profile, isLoading: isLoadingProfile } = useAuthContext();

  const phoneVerified = isLoadingProfile || profile?.parent_phone_verification;

  useEffect(() => {
    if (!data && !isLoading && subscribed) {
      router.push("/ErrorPage");
    }
  }, [data, isLoading, router, subscribed]);

  if (isLoading) {
    return (
      <div className="h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!subscribed)
    return (
      <div className="h-screen">
        <Empty isError text={text || " انت غير مشترك في هذا الكورس  "} />
      </div>
    );

  if (!data) {
    return (
      <div className="h-screen">
        <Empty text={" لا يوجد بيانات "} />
      </div>
    );
  }

  if (!phoneVerified)
    return (
      <PhoneVerificationAlertModal
        initialOpen={true}
        phone={profile?.parent_phone}
      />
    );

  return <>{children}</>;
};

export default ProtectedRoute;
