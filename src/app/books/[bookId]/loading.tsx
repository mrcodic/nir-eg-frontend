import LoadingSpinner from "@/components/Loading";

function loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>
  );
}

export default loading;
