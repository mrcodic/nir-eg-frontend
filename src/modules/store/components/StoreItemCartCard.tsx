import CustomImage from "@/components/ui/CustomImage";
import DataWithLabel from "@/components/ui/DataWithLabel";
import { useTenant } from "@/context/TenantProvider";
import { cn, formatCurrency } from "@/lib/utils";
import { CartItem } from "@/store/storeCartStore";
import { Trash } from "lucide-react";
import RemoveFromCart from "./RemoveFromCart";
import StoreItemQuantity from "./StoreItemQuantity";

function StoreItemCartCard({
  item,
  className,
}: {
  item: CartItem;
  className?: string;
}) {
  const { features } = useTenant();
  const hasPointsEnabled = !!features?.points_system;

  return (
    <div
      className={cn(
        "flex items-center gap-6 pt-6 pb-3 max-[450px]:flex-col",
        className,
      )}
    >
      <div className="bg-background relative aspect-square size-24 shrink-0 overflow-hidden rounded-lg max-[450px]:hidden">
        <CustomImage
          src={item?.image}
          fallback="/assets/book.svg"
          alt="book"
          className="object-contain"
          fill
        />
      </div>

      <div className="w-full space-y-4">
        <div className="flex flex-col gap-1">
          <RemoveFromCart
            id={item.id}
            className="ms-auto h-auto w-fit bg-transparent p-0 text-red-500 hover:bg-transparent"
          >
            <Trash className="size-6" />{" "}
            <span className="font-bold underline">ازالة من السلة</span>
          </RemoveFromCart>

          <div className="space-y-2">
            <div className="bg-background relative hidden aspect-square size-24 shrink-0 overflow-hidden rounded-lg max-[450px]:block">
              <CustomImage
                src={item?.image}
                fallback="/assets/book.svg"
                alt="book"
                className="object-contain"
                fill
              />
            </div>

            <h3 className="border-gray-light border-b pb-2 text-lg font-bold">
              {item?.name}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <DataWithLabel
              className="flex-wrap gap-y-1"
              label="سعر القطعة"
              labelClassName="sm:text-base text-sm"
              dataClassName="sm:text-base text-sm"
              data={formatCurrency(item.price)}
            />

            {hasPointsEnabled &&
              item.can_buy_points &&
              item.points_price !== null && (
                <DataWithLabel
                  className="flex-wrap gap-y-1"
                  label="سعر القطعة بالنقاط"
                  labelClassName="sm:text-base text-sm"
                  dataClassName="sm:text-base text-sm"
                  data={`${item.points_price} نقطة`}
                />
              )}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2 gap-y-6">
            {item.quantity > 1 && (
              <div className="flex flex-col gap-2">
                <DataWithLabel
                  className="flex-wrap gap-y-1"
                  label="اجمالي السعر"
                  labelClassName="sm:text-base text-sm"
                  data={formatCurrency(
                    (item.quantity || 1) * Number(item.price),
                  )}
                  dataClassName="text-white sm:text-base text-sm bg-[#1EAD7B] py-1 px-2 rounded-lg"
                />

                {hasPointsEnabled &&
                  item.can_buy_points &&
                  item.points_price !== null && (
                    <DataWithLabel
                      className="flex-wrap gap-y-1"
                      label="اجمالي النقاط"
                      labelClassName="sm:text-base text-sm"
                      data={`${(item.quantity || 1) * item.points_price} نقطة`}
                      dataClassName="text-white sm:text-base text-sm bg-secondary py-1 px-2 rounded-lg font-bold"
                    />
                  )}
              </div>
            )}

            <StoreItemQuantity
              item={item}
              className="ms-auto gap-4"
              textClassName="text-[24px]"
              buttonClassName="size-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreItemCartCard;
