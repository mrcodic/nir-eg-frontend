import { X } from "lucide-react";
import Image from "next/image";

function VideoQuestionBtn({ playerRef, setHideBtn }: any) {
  return (
    <button
      onClick={() => {
        const inputEl = document.getElementById("community-input");
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: "smooth" });
          (inputEl as HTMLElement).focus?.();
        }
        const inst = playerRef.current;
        inst?.video?.pause?.();
      }}
      className="absolute z-5 text-primary-800 border border-gray-light transition-all p-2 md:w-[250px] w-[190px] py-4 rounded-lg right-4 bg-background bottom-14"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setHideBtn(true);
        }}
        className="absolute cursor-pointer bg-semantics-red-50 top-2 left-2 rounded-full flex items-center justify-center size-4 hover:bg-semantics-red group transition-all"
      >
        <X className="stroke-semantics-red size-3 stroke-4 group-hover:stroke-white transition-all" />
      </div>

      <div className="flex items-center gap-2">
        <Image
          src="/assets/question-icon.svg"
          width={32}
          height={32}
          alt="icon-1"
        />
        <span className="text-[16px] font-bold"> عندك استفسار؟</span>
      </div>
    </button>
  );
}

export default VideoQuestionBtn;
