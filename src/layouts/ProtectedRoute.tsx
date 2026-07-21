"use client";

import PhoneVerificationAlertModal from "@/components/modals/PhoneVerificationAlertModal";
import Empty from "@/components/shared/Empty";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  subscribed: boolean;
  data: any;
  isLoading?: boolean;
  text?: string;
  verifyPhone?: boolean;
  emptyMessage?: string;
};

const ProtectedRoute = ({
  children,
  subscribed,
  data,
  isLoading,
  text,
  verifyPhone = false,
  emptyMessage = "",
}: Props) => {
  const router = useRouter();
  const { profile, isLoading: isLoadingProfile } = useAuthContext();

  const phoneVerified = profile?.student_phone_verification;

  if (isLoading || isLoadingProfile) {
    return (
      <div className="h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (data && !subscribed)
    return (
      <Empty
        isPageError
        isError
        text={text || " انت غير مشترك في هذا الكورس  "}
      />
    );

  if (!data) {
    return <Empty isPageError text={emptyMessage || " لا يوجد بيانات "} />;
  }

  if (verifyPhone && !phoneVerified)
    return (
      <div className="h-screen">
        <Empty
          isError
          text={"لا يمكن عرض هذا المحتوى بدون تأكيد رقم ولي الأمر"}
        >
          <Button className="h-9" onClick={() => router.back()}>
            رجوع
          </Button>
        </Empty>

        <PhoneVerificationAlertModal phone={profile?.phone} />
      </div>
    );

  return children;
};

export default ProtectedRoute;
