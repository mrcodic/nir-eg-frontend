function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-dark">جاري التحميل...</p>
      </div>
    </div>
  );
}

export default LoadingFallback;
