const formatTime = (num) => num.toString().padStart(2, "0");

function CountDownTimerUI({ minutes, seconds }) {
  return (
    <div className=" flex-1 flex gap-2  items-center text-gray-dark justify-center ">
      <span className="text-gray-dark font-bold inline-block text-xl">
        هذا الرمز صالح لمدة
      </span>
      <div className="text-[#B75050] font-bold text-xl">
        <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
      </div>
    </div>
  );
}

export default CountDownTimerUI;
