import LoadingSpinner from "@/components/Loading";

const loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};

export default loading;
