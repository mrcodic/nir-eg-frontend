const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

function FilterStatus({ customTime, resetToCurrentTime }) {
  return (
    <div className="mb-3 p-2 bg-blue-50 rounded-md flex items-center justify-between">
      <span className="text-[11px] text-blue-700">
        عرض التعليقات عند {formatTime(customTime)} (±5 دقائق)
      </span>
      <button
        onClick={resetToCurrentTime}
        className="text-[10px] text-blue-600 hover:text-blue-800 underline"
      >
        العودة للوقت الحالي
      </button>
    </div>
  );
}

export default FilterStatus;
