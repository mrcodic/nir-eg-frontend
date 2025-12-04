import StoreCard from "@/components/cards/StoreCard";
import Empty from "@/components/Empty";
import MappingFun from "@/components/MappingFunc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerData } from "@/helpers/server-fetch";
import StudentPointsCard from "@/modules/profile/components/StudentPointsCard";
import { Suspense } from "react";

const StorePage = async () => {
  const data = await getServerData({
    queryKey: ["/students/store/items"],
  });
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
                  value={tab.value}
                  key={tab.title}
                  className=" group "
                >
                  <TabsTrigger
                    key={index}
                    value={tab.value}
                    className={`group min-w-24 rounded-lg data-[state=active]:bg-primary-800 cursor-pointer data-[state=active]:text-white bg-white text-[#523412] flex items-center gap-2 border border-primary-800 px-px py-1 md:p-2 `}
                  >
                    <img
                      className="size-6 group-data-[state=active]:invert group-data-[state=active]:brightness-0 transition-all duration-300 ease-in-out"
                      src={tab.icon}
                    />
                    <span className="text-sm text-primary-800 group-data-[state=active]:text-white transition-all duration-300 ease-in-out font-bold">
                      {tab.title}
                    </span>
                  </TabsTrigger>
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>

        <Suspense fallback={<div>Loading...</div>}>
          <TabsContent value="all">
            <MappingFun
              queryKey={`/students/store/items`}
              arraypath="body.gifts"
              render={(data) => {
                return (
                  <div className=" gap-5 grid grid-cols-1 md:grid-cols-3 ">
                    {data?.body.gifts.map((gift, i) => {
                      return <StoreCard gift={gift} />;
                    })}
                  </div>
                );
              }}
            />
          </TabsContent>

          <TabsContent value="fav">
            <MappingFun
              queryKey={`/students/profile/my_favorites_store`}
              arraypath="body.gifts"
              errorComponent={<Empty className="min-h-[520px]" />}
              render={(data) => {
                return (
                  <div className=" gap-5 grid grid-cols-1 md:grid-cols-3 ">
                    {data?.body.gifts.map((gift, i) => {
                      return <StoreCard gift={gift} />;
                    })}
                  </div>
                );
              }}
            />
          </TabsContent>

          <TabsContent value="gifts">
            <MappingFun
              queryKey={`/students/profile/my_redemptions_store`}
              arraypath="body.gifts"
              errorComponent={<Empty className="min-h-[520px]" />}
              render={(data) => {
                return (
                  <div className=" gap-5 grid grid-cols-1 md:grid-cols-3 ">
                    {data?.body.gifts.map((gift, i) => {
                      return <StoreCard gift={gift} />;
                    })}
                  </div>
                );
              }}
            />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
};
export default StorePage;
