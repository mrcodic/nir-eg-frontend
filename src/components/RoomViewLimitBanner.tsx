import { X } from "lucide-react";
import { useState } from "react";

function RoomViewLimitBanner({ viewCount }: { viewCount: any }) {
  const [hideBanner, setHideBanner] = useState(false);
  if (hideBanner) {
    return null;
  }
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded absolute top-2 inset-x-2 w-[calc(100%-1rem)] z-10">
      <button
        onClick={() => setHideBanner(true)}
        className="absolute top-1 left-1 cursor-pointer"
      >
        <X className="stroke-yellow-700 size-5" />
      </button>
      عدد المشاهدات المسموح هو <strong>{viewCount.total_views}</strong>، متبقي
      لك <strong>{viewCount.remaining}</strong> مشاهدة ويتم احتساب المشاهدة بعد
      اول 15 دقيقة في الفيديو.
    </div>
  );
}

export default RoomViewLimitBanner;
