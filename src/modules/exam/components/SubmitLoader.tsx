import SmallSpinner from "@/components/custom/SmallSpinner";

function SubmitLoader({ isSubmitting }) {
  return (
    isSubmitting && (
      <div className="fixed top-1/2 left-1/2 z-99999 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border border-gray-200 bg-[#F9FAFC] p-4 shadow-md">
        <SmallSpinner className="text-primary-800" />
        <span>جارى ارسال اجاباتك</span>
      </div>
    )
  );
}

export default SubmitLoader;
