import CustomLoader from "@/components/custom/Loader";

function SubmitLoader({ isSubmitting }) {
  return (
    isSubmitting && (
      <div className="fixed left-1/2 top-1/2 shadow-md border border-gray-200  -translate-x-1/2 z-99999 -translate-y-1/2 bg-[#F9FAFC] rounded-2xl p-4 flex items-center gap-2">
        <CustomLoader />
        <span>جارى ارسال اجاباتك</span>
      </div>
    )
  );
}

export default SubmitLoader;
