import Image from "next/image";
import TopBanner from "@/components/banners/TopBanner";

function LockedToPassVideoUI({ exceededViews }: { exceededViews: boolean }) {
  return (
    <div className="flex-1 space-y-8">
      <TopBanner
        icon="/assets/warning-fill.svg"
        render={
          <p className="text-sm">
            {exceededViews
              ? "لقد تجاوزت الحد الأقصى لعدد المشاهدات المسموح بها لهذا الدرس"
              : "يجب ان تقوم باجتياز الاختبار أولا"}
          </p>
        }
      />
      <div className="flex h-[520px] w-full flex-1 items-center justify-center bg-gray-100">
        <Image src="/assets/Locked.png" width={150} height={150} alt="Locked" />
      </div>
    </div>
  );
}

export default LockedToPassVideoUI;
