import MappingFun from "@/components/fetchers/MappingFunc";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import PointsStoreCard from "@/modules/points-store/components/PointsStoreCard";
import StudentPointsCard from "@/modules/profile/components/StudentPointsCard";
import { IUser } from "@/types";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const tabs = [
  {
    title: "الكل",
    icon: "/assets/store-fill.svg",
    api: "/students/store/items",
    value: "all",
    emptyProps: {
      text: "لا يوجد هدايا",
    },
  },
  {
    title: "المفضلة",
    icon: "/assets/heart.svg",

    api: "/students/profile/my_favorites_store",
    value: "fav",
    emptyProps: {
      text: "لم تقم بإضافة هدايا للمفضلة",
      icon: "/assets/bg/empty-2.png",
    },
  },
  {
    title: "الهدايا",
    icon: "/assets/gift-fill.svg",

    api: "/students/profile/my_redemptions_store",
    value: "gifts",
    emptyProps: {
      text: "لا يوجد هدايا",
    },
  },
];

const mapTabsToEndpoints = {
  all: "/students/store/items",
  fav: "/students/profile/my_favorites_store",
  gifts: "/students/profile/my_redemptions_store",
};

const StorePage = async () => {
  redirect("/");

  const profileData = await getServerData<{ body: IUser }>({
    queryKey: ["/students/profile"],
  });

  return (
    <div className="wrapper mt-[150px]">
      <div className="bg-background rounded-lg p-4">
        <StudentPointsCard points={profileData?.body.points} showLink={false} />
      </div>

      <Tabs
        defaultValue="all"
        className="mt-16 w-full space-y-8 md:mt-22"
        dir="rtl"
      >
        <TabsList className="flex w-full justify-center">
          <div className="flex w-full justify-center gap-2 font-bold max-sm:flex-col md:gap-6">
            {tabs.map((tab, index) => {
              return (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className={`group data-[state=active]:bg-primary-800 border-primary-800 flex min-w-24 cursor-pointer items-center gap-2 rounded-lg border bg-white px-px py-1 text-[#523412] data-[state=active]:text-white md:p-2`}
                >
                  <span
                    className="bg-primary size-6 transition-colors duration-300 group-data-[state=active]:bg-white"
                    style={{
                      WebkitMask: `url(${tab.icon}) no-repeat center / contain`,
                      mask: `url(${tab.icon}) no-repeat center / contain`,
                    }}
                  />

                  <h5 className="text-primary-800 text-sm font-bold transition-all duration-300 ease-in-out group-data-[state=active]:text-white">
                    {tab.title}
                  </h5>
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <Skeleton className="min-h-[232px]! w-full rounded-lg" />
                  <Skeleton className="min-h-[156px]! w-full rounded-lg" />
                </div>
              ))}
            </div>
          }
        >
          {Object.entries(mapTabsToEndpoints).map(([key, value]) => {
            return (
              <TabsContent value={key} key={key}>
                <MappingFun
                  queryKey={value}
                  arraypath="body.gifts"
                  emptyProps={tabs.find((tab) => tab.value === key)?.emptyProps}
                  render={(data) => {
                    return (
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {data?.body.gifts.map((gift, i) => {
                          return <PointsStoreCard key={i} storeItem={gift} />;
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
