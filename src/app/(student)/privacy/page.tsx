import { getServerData } from "@/helpers/fetchers/server-fetch";
import { IFooterData } from "@/types/settings.types";

const PrivacyPolicy = async () => {
  const footerResponse = await getServerData<{ data: IFooterData }>({
    queryKey: ["settings/footer"],
    isAuth: false,
  });

  const footerSettings = footerResponse?.data;

  return (
    <div className="wrapper my-[150px] rounded-lg bg-white p-6">
      <h1 className="mb-4 text-right text-2xl font-bold text-gray-900">
        سياسة الخصوصية
      </h1>

      <pre>{footerSettings?.pages?.privacy}</pre>
    </div>
  );
};

export default PrivacyPolicy;
