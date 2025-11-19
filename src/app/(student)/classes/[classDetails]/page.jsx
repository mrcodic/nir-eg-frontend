const ClassDetails = () => {
  return (
    <div class="w-[85%] h-full mx-auto">
      <div class="flex items-start py-20 gap-4">
        <div class="w-1/4">
          <div class="flex items-center gap-2">
            <img src="../assets/Rooms1.svg" class="w-[20px] h-[20px]" />
            <span class="text-[18px] font-bold">
              حصة رقم 15 - مراجعة ليلة الامتحان - الصف الثاني
            </span>
          </div>
          <div class="flex flex-wrap mt-4 items-center mr-6">
            <div class="flex gap-[6px] items-center text-[#41474B] font-normal">
              <img
                class="w-[15px] h-[15px]"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(77%) sepia(70%) saturate(3942%) hue-rotate(348deg) brightness(97%) contrast(99%)",
                }}
                src="/assets/time-1.svg"
              />
              <span>5 ساعات و 40 دقيقة</span>
            </div>
            <div class="flex mr-6 gap-[6px] items-center text-[#41474B] font-normal">
              <img
                class="w-[15px] h-[15px]"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(77%) sepia(70%) saturate(3942%)  hue-rotate(348deg) brightness(97%) contrast(99%)",
                }}
                src="/assets/time-1.svg"
              />
              <span>8 دروس </span>
            </div>
            <div class="flex gap-[6px] mt-2 items-center text-[#41474B] font-normal">
              <img
                class="w-[15px] h-[15px]"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(77%) sepia(70%) saturate(3942%) hue-rotate(348deg) brightness(97%) contrast(99%)",
                }}
                src="/assets/Progress.svg"
              />
              <span>تم الانتهاء من 0%</span>
            </div>
          </div>
          <ul class="list-none mt-[18px] flex flex-col gap-4 py-[12px]">
            <li class="text-[12px] py-[4px] flex justify-between font-bold">
              <div class="flex gap-2 items-center">
                <div class="w-[20px] h-[20px] flex items-center text-center py-[0.82px] justify-center bg-[#20364E] text-white rounded-md text-[10.5px]">
                  01
                </div>
                <span>درس 01 - إجابات الامتحان</span>
              </div>
              <button class="lesson-btn flex items-center py-[8px] px-[4px] gap-2 bg-[#E2F5FC] text-[#2E77AE] text-[12px] rounded-md">
                <img src="/assets/Done.svg" />
                <span> انهيت الدرس؟</span>
              </button>
            </li>
            <li class="text-[12px] py-[4px] flex justify-between font-bold">
              <div class="flex gap-2 items-center">
                <div class="w-[20px] h-[20px] flex items-center text-center py-[0.82px] justify-center bg-[#20364E] text-white rounded-md text-[10.5px]">
                  01
                </div>
                <span>درس 01 - إجابات الامتحان</span>
              </div>
              <button class="lesson-btn flex items-center py-[8px] px-[4px] gap-2 bg-[#E2F5FC] text-[#2E77AE] text-[12px] rounded-md">
                <img src="/assets/Done.svg" />
                <span> انهيت الدرس؟</span>
              </button>
            </li>
            <li class="text-[12px] py-[4px] flex justify-between font-bold">
              <div class="flex gap-2 items-center">
                <div class="w-[20px] h-[20px] flex items-center text-center py-[0.82px] justify-center bg-[#20364E] text-white rounded-md text-[10.5px]">
                  01
                </div>
                <span>درس 01 - إجابات الامتحان</span>
              </div>
              <button class="lesson-btn flex items-center py-[8px] px-[4px] gap-2 bg-[#E2F5FC] text-[#2E77AE] text-[12px] rounded-md">
                <img src="/assets/Done.svg" />
                <span> انهيت الدرس؟</span>
              </button>
            </li>
            <li class="text-[12px] py-[4px] flex justify-between font-bold">
              <div class="flex gap-2 items-center">
                <div class="w-[20px] h-[20px] flex items-center text-center py-[0.82px] justify-center bg-[#20364E] text-white rounded-md text-[10.5px]">
                  01
                </div>
                <span>درس 01 - إجابات الامتحان</span>
              </div>
              <button class="lesson-btn flex items-center py-[8px] px-[4px] gap-2 bg-[#E2F5FC] text-[#2E77AE] text-[12px] rounded-md">
                <img src="/assets/Done.svg" />
                <span> انهيت الدرس؟</span>
              </button>
            </li>
            <li class="text-[12px] py-[4px] flex justify-between font-bold">
              <div class="flex gap-2 items-center">
                <div class="w-[20px] h-[20px] flex items-center text-center py-[0.82px] justify-center bg-[#20364E] text-white rounded-md text-[10.5px]">
                  01
                </div>
                <span>درس 01 - إجابات الامتحان</span>
              </div>
              <button class="lesson-btn flex items-center py-[8px] px-[4px] gap-2 bg-[#E2F5FC] text-[#2E77AE] text-[12px] rounded-md">
                <img src="/assets/Done.svg" />
                <span> انهيت الدرس؟</span>
              </button>
            </li>
          </ul>
        </div>
        <video
          id="my-video"
          class="video-js bg-[#D9DADB] flex-1 overflow-hidden rounded-lg! h-[477px]"
          controls
          preload="auto"
          data-setup='{
"techOrder": ["youtube"],
"sources": [{ "type": "video/youtube", "src": "https://www.youtube.com/watch?v=UL3KdI7_5_E" }]
}'
        />
      </div>
    </div>
  );
};
export default ClassDetails;
