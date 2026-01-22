import { getServerData } from "@/helpers/server-fetch";
import { IFooterData } from "@/types/settings.types";

const TermsPage = async () => {
  const footerResponse = await getServerData<{ data: IFooterData }>({
    queryKey: ["settings/footer"],
    isAuth: false,
  });

  const footerSettings = footerResponse?.data;

  return (
    <div className="wrapper my-[150px] rounded-lg bg-white p-6">
      <h1 className="mb-4 text-right text-2xl font-bold text-gray-900">
        الشروط و الأحكام
      </h1>

      <pre>{footerSettings?.pages?.terms}</pre>
    </div>
  );
};

export default TermsPage;
