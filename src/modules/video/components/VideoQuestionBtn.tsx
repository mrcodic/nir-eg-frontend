import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function VideoQuestionBtn({ playerRef, videoId, isBunnyPlayer = false }: any) {
  const [hideBtn, setHideBtn] = useState(false);

  useEffect(() => {
    if (videoId) setHideBtn(false);
  }, [videoId]);

  if (hideBtn) return null;

  return (
    <button
      onClick={() => {
        const inputEl = document.getElementById("community-input");
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: "smooth" });
          (inputEl as HTMLElement).focus?.();
        }
        const inst = playerRef.current;

        if (isBunnyPlayer) {
          inst?.pause?.();
        } else {
          inst?.video?.pause?.();
        }
      }}
      className="text-primary-800 border-gray-light bg-background hover:border-primary hover:bg-primary-100 absolute right-4 bottom-16 z-5 w-[190px] cursor-pointer rounded-lg border p-2 py-4 transition-all md:w-[250px]"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setHideBtn(true);
        }}
        className="bg-semantics-red-50 hover:bg-semantics-red group absolute top-2 left-2 flex size-4 cursor-pointer items-center justify-center rounded-full transition-all"
      >
        <X className="stroke-semantics-red size-3 stroke-4 transition-all group-hover:stroke-white" />
      </div>

      <div className="flex items-center gap-2">
        <Image
          src="/assets/question-icon.svg"
          width={32}
          height={32}
          alt="icon-1"
        />
        <span className="text-base font-bold"> عندك استفسار؟</span>
      </div>
    </button>
  );
}

export default VideoQuestionBtn;
