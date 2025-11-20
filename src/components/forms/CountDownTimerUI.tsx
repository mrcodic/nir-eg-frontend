const formatTime = (num) => num.toString().padStart(2, "0");

function CountDownTimerUI({ minutes, seconds }) {
  return (
    <div className="flex mt-[32px] gap-[24px] w-full">
      <div className=" flex-1 flex gap-2  items-center text-gray-dark ">
        <span className="text-[#121212] font-bold inline-block text-[18px]">
          هذا الرمز صالح لمدة
        </span>
        <div className="text-[#B75050] font-bold text-[20px]">
          <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
        </div>
      </div>
    </div>
  );
}

export default CountDownTimerUI;
