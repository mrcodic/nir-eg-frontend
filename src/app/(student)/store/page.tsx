import StoreCard from "@/components/cards/StoreCard";
import MappingFun from "@/components/MappingFunc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerData } from "@/helpers/server-fetch";
import StudentPointsCard from "@/modules/profile/components/StudentPointsCard";
import Image from "next/image";
import { Suspense } from "react";

const tabs = [
  {
    title: "الكل",
    icon: "/assets/store-fill.svg",
    api: "/students/store/items",
    value: "all",
  },
  {
    title: "المفضلة",
    icon: "/assets/heart.svg",

    api: "/students/profile/my_favorites_store",
    value: "fav",
  },
  {
    title: "الهدايا",
    icon: "/assets/gift-fill.svg",

    api: "/students/profile/my_redemptions_store",
    value: "gifts",
  },
];

const mapTabsToEndpoints = {
  all: "/students/store/items",
  fav: "/students/profile/my_favorites_store",
  gifts: "/students/profile/my_redemptions_store",
};

const StorePage = async () => {
  const data = await getServerData({
    queryKey: ["/students/store/items"],
  });

  return (
    <div className="wrapper mt-[150px] ">
      <div className="bg-background rounded-lg p-4">
        <StudentPointsCard points={data?.body.user_points} showLink={false} />
      </div>

      <Tabs defaultValue="all" className="w-full space-y-8 mt-22" dir="rtl">
        <TabsList className="flex justify-center  w-full mt-10  ">
          <div className="flex font-bold max-sm:flex-col justify-center w-full gap-2 md:gap-6 my-10 ">
            {tabs.map((tab, index) => {
              return (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className={`group min-w-24 rounded-lg data-[state=active]:bg-primary-800 cursor-pointer data-[state=active]:text-white bg-white text-[#523412] flex items-center gap-2 border border-primary-800 px-px py-1 md:p-2 `}
                >
                  <Image
                    className="size-6 group-data-[state=active]:invert group-data-[state=active]:brightness-0 transition-all duration-300 ease-in-out"
                    src={tab.icon}
                    alt={tab.title}
                    width={24}
                    height={24}
                  />
                  <h5 className="text-sm text-primary-800 group-data-[state=active]:text-white transition-all duration-300 ease-in-out font-bold">
                    {tab.title}
                  </h5>
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>

        <Suspense fallback={<div>Loading...</div>}>
          {Object.entries(mapTabsToEndpoints).map(([key, value]) => {
            return (
              <TabsContent value={key} key={key}>
                <MappingFun
                  queryKey={value}
                  arraypath="body.gifts"
                  render={(data) => {
                    return (
                      <div className=" gap-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ">
                        {data?.body.gifts.map((gift, i) => {
                          return <StoreCard key={i} storeItem={gift} />;
                        })}
                      </div>
                    );
                  }}
                />
              </TabsContent>
            );
          })}
        </Suspense>
      </Tabs>
    </div>
  );
};
export default StorePage;
