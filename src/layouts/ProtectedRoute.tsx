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
};

const ProtectedRoute = ({
  children,
  subscribed,
  data,
  isLoading,
  text,
  verifyPhone = false,
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

        <PhoneVerificationAlertModal
          initialOpen={true}
          phone={profile?.parent_phone}
        />
      </div>
    );

  return <>{children}</>;
};

export default ProtectedRoute;
