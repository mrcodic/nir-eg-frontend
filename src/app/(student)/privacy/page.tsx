"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("https://nir-edu.com/privacy");
  }, [router]);

  return (
    <div className="wrapper my-[150px]">
      <LoadingSpinner />
    </div>
  );
  // const footerResponse = await getServerData<{ data: IFooterData }>({
  //   queryKey: ["settings/footer"],
  //   isAuth: false,
  // });

  // const footerSettings = footerResponse?.data;

  // return (
  //   <div className="wrapper my-[150px] rounded-lg bg-white p-6">
  //     <h1 className="mb-4 text-right text-2xl font-bold text-gray-900">
  //       سياسة الخصوصية
  //     </h1>

  //     <pre>{footerSettings?.pages?.privacy}</pre>
  //   </div>
  // );
};

export default PrivacyPolicy;
