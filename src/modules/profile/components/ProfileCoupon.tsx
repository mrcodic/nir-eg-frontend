import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useCoupon from "@/hooks/useCoupon";
import Image from "next/image";

function ProfileCoupon() {
  const { toast } = useToast();
  const { data, isLoading, error, discountValue } = useCoupon();

  if (isLoading || !data || error) return null;

  console.log("coupon data ", data);

  return (
    <div className="flex max-sm:flex-col md:ms-auto">
      <div className="bg-[#1EAD7B] relative max-sm:rounded-t-lg sm:rounded-r-lg p-4 flex flex-col items-center sm:ps-8 max-sm:pt-6 justify-center">
        <div className="absolute sm:right-0 top-0 z-10 max-sm:inset-x-0 sm:inset-y-0 h-full flex sm:flex-col gap-1.5 justify-center ">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="size-6 shrink-0 bg-background rounded-full sm:translate-x-1/2 max-sm:-translate-y-1/2"
              />
            ))}
        </div>

        <Image
          className="size-8"
          src="/percentage.gif"
          width={32}
          height={32}
          alt="percentage"
        />

        <p className="text-white font-bold text-sm text-center">
          حتى {data?.end_date}
        </p>
      </div>

      <div className="flex max-sm:flex-col gap-4 flex-wrap  sm:justify-between lg:ms-auto items-end  bg-white py-2 px-4 relative max-sm:justify-center max-sm:items-center">
        <div className="absolute sm:border-r-4 max-sm:border-t-4 border-dashed sm:-right-0.5 sm:inset-y-0 border-black sm:h-full top-0 max-sm:inset-x-0 " />

        <div className=" rounded-lg p-2 flex items-center gap-4 max-sm:flex-col">
          <Image
            className="size-16"
            src="/percentage.gif"
            width={64}
            height={64}
            alt="percentage"
          />

          <div>
            <p className="text-[#232027] font-bold ">
              احصل على خصم {discountValue}
            </p>
            <p className="text-gray-dark font-medium text-sm">
              {data?.description || `خصم ${discountValue} على الكورس`}
            </p>
          </div>
        </div>

        <div className="flex items-end sm:gap-4 gap-2 sm:ms-auto ">
          <p className="text-white font-bold bg-[#1EAD7B] py-1 px-2 rounded-lg  text-center animate-promo-rotate-shake w-fit uppercase break-all">
            {data?.code}
          </p>

          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(data?.code);
                toast({
                  description: "تم النسخ",
                  icon: "success",
                });
              } catch (err) {
                console.error("Failed to copy:", err);
                toast({
                  description: "لم يتم النسخ",
                  icon: "error",
                });
              }
            }}
            className="bg-primary ms-auto border border-gray-light rounded-lg  text-sm font-bold size-8 "
            size="icon"
          >
            <Image
              src="/assets/copy.svg"
              width={20}
              height={20}
              alt="copy"
              className="brightness-0 invert"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCoupon;
