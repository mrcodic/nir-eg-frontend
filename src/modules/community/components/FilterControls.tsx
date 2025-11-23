import { Dispatch, SetStateAction } from "react";

function FilterControls({
  filterMode,
  setFilterMode,
}: {
  filterMode: string;
  setFilterMode: Dispatch<SetStateAction<"current" | "all">>;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setFilterMode("current")}
        className={`px-3 py-1 text-[10px] rounded-md transition-colors ${
          filterMode === "current"
            ? "bg-gray-light text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        الوقت الحالي
      </button>
      <button
        onClick={() => setFilterMode("all")}
        className={`px-3 py-1 text-[10px] rounded-md transition-colors ${
          filterMode === "all"
            ? "bg-gray-light text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        جميع التعليقات
      </button>
    </div>
  );
}

export default FilterControls;
