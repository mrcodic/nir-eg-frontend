import LoadingSpinner from "@/components/shared/LoadingSpinner";

const loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default loading;
