import LoadingSpinner from "@/components/LoadingSpinner";

const loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default loading;
