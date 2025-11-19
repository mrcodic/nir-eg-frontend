import StoreCard from "@/components/cards/StoreCard";
import StoreCardTab from "@/components/cards/StoreCardTab";
import DoubledText from "@/components/DoubledText";
import Empty from "@/components/Empty";
import MappingFun from "@/components/MappingFunc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getData } from "@/utils/api";

const StorePage = async () => {
  const data = await getData({ queryKey: ["/students/store/items"] });
  const tabs = [
    {
      label: "الكل",
      icon: "/assets/StoreColor.svg",
      api: "/students/store/items",
      value: "all",
    },
    {
      label: "المفضلة",
      icon: "/assets/heart.svg",

      api: "/students/profile/my_favorites_store",
      value: "fav",
    },
    {
      label: "الهدايا",
      icon: "/assets/gift.svg",

      api: "/students/profile/my_redemptions_store",
      value: "gifts",
    },
  ];

  return (
    <div className="mx-auto md:px-32 mt-[150px] ">
      <div
        style={{
          boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
        }}
        className="bg-[#F9FAFC] md:text-[24px] whitespace-nowrap
             font-bold  flex flex-col  gap-[24px]  m-[100px]     border py-2  px-[40px] border-[#012D5A] rounded-[8px]"
      >
        <div className="flex gap-7 items-center">
          <img src="../assets/Star.svg" className="w-[48px] h-[48px]" />

          <span className=" text-[#523412] inline-block">النقاط</span>
        </div>

        <div className="relative mr-20   -top-2 -right-5">
          {" "}
          <h3 className="textStroke text-[32px] relative flex items-center  -top-[18px]  z-0">
            {" "}
            <span>{data?.body.user_points} نقطة</span>
          </h3>
          <h3 className="text-color-primary flex items-center absolute -top-[15px] z-10 text-[32px]">
            <span>{data?.body.user_points} نقطة</span>
          </h3>
        </div>
      </div>
      {/* <TabsDemo /> */}

      <div className="w-[85%] mx-auto my-6 ">
        <div className="flex">
          <DoubledText text="المتجر" icon={"/assets/gift.svg"} />
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full space-y-8" dir="rtl">
        <TabsList className=" w-full ">
          <div className=" flex justify-center my-14">
            <div className="flex gap-10 text-[#0D2237] text-[16px] font-bold p-4 items-center">
              {tabs.map((tab) => {
                return (
                  <TabsTrigger
                    value={tab.value}
                    key={tab.label}
                    className=" group "
                  >
                    <StoreCardTab tab={tab} />
                  </TabsTrigger>
                );
              })}
            </div>
          </div>
        </TabsList>
        <TabsContent value="all">
          <div className=" gap-5 grid grid-cols-1 md:grid-cols-3 ">
            <MappingFun
              queryKey={`/students/store/items`}
              arraypath="body.gifts"
              render={(data) => {
                return data?.body.gifts.map((gift, i) => {
                  return <StoreCard gift={gift} />;
                });
              }}
            />
          </div>
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
      </Tabs>
    </div>
  );
};
export default StorePage;
