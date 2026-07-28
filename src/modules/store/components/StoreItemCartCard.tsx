import CustomImage from "@/components/ui/CustomImage";
import DataWithLabel from "@/components/ui/DataWithLabel";
import OrSeparator from "@/components/ui/or-separator";
import { useTenant } from "@/context/TenantProvider";
import { cn, formatCurrency } from "@/lib/utils";
import { CartItem } from "@/store/storeCartStore";
import { StoreItemPaymentType } from "@/types/store.types";
import { Trash } from "lucide-react";
import RemoveFromCart from "./RemoveFromCart";
import StoreItemQuantity from "./StoreItemQuantity";

function StoreItemCartCard({
  item,
  className,
  isCouponApplied = false,
}: {
  item: CartItem;
  className?: string;
  isCouponApplied?: boolean;
}) {
  const { features } = useTenant();
  const hasPointsEnabled = !!features?.points_system;
  const supportsCash = item.payment_type !== StoreItemPaymentType.Points;
  const supportsPoints =
    hasPointsEnabled &&
    item.payment_type !== StoreItemPaymentType.Cash &&
    item.points_price !== null;

  return (
    <div
      className={cn(
        "flex items-center gap-6 rounded-lg border px-3 pt-6 pb-3 max-[450px]:flex-col",
        isCouponApplied && "border-semantics-green bg-semantics-green/5",
        className,
      )}
    >
      <div className="bg-background relative aspect-square size-24 shrink-0 overflow-hidden rounded-lg max-[450px]:hidden">
        <CustomImage
          src={item?.image || "/assets/grade-placeholder.png"}
          fallback="/assets/grade-placeholder.png"
          alt="book"
          className="object-contain"
          fill
        />
      </div>

      <div className="w-full space-y-4">
        <div className="flex flex-col gap-1">
          <RemoveFromCart
            id={String(item.id)}
            className="ms-auto h-auto w-fit bg-transparent p-0 text-red-500 hover:bg-transparent"
          >
            <Trash className="size-3!" />{" "}
            <span className="text-xs! font-bold underline">ازالة من السلة</span>
          </RemoveFromCart>

          <div className="space-y-2">
            <div className="bg-background relative hidden aspect-square size-24 shrink-0 overflow-hidden rounded-lg max-[450px]:block">
              <CustomImage
                src={item?.image || "/assets/grade-placeholder.png"}
                fallback="/assets/grade-placeholder.png"
                alt="book"
                className="object-contain"
                fill
              />
            </div>

            <h3 className="border-gray-light border-b pb-2 text-lg font-bold">
              {item?.name}
            </h3>
            {isCouponApplied && (
              <p className="text-semantics-green text-xs font-bold">
                تم تطبيق كود الخصم على هذا المنتج
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {supportsCash && (
              <DataWithLabel
                className="flex-wrap gap-y-1"
                label="سعر القطعة"
                labelClassName=" text-sm"
                dataClassName=" text-sm"
                data={formatCurrency(item.price)}
              />
            )}

            {supportsPoints && (
              <DataWithLabel
                className="flex-wrap gap-y-1"
                label="سعر القطعة بالنقاط"
                labelClassName=" text-sm"
                dataClassName=" text-sm"
                data={`${item.points_price} نقطة`}
              />
            )}
          </div>

          <div
            className={cn(
              "flex flex-wrap items-end justify-between gap-2 gap-y-6",
              {
                "border-gray-light border-t pt-2": item?.quantity > 1,
              },
            )}
          >
            {item.quantity > 1 && (
              <div className="flex flex-col">
                {supportsCash && (
                  <DataWithLabel
                    className="flex-wrap gap-y-1"
                    label="اجمالي السعر"
                    labelClassName=" text-sm"
                    data={formatCurrency(
                      (item.quantity || 1) * Number(item.price),
                    )}
                    dataClassName=" text-sm"
                  />
                )}

                {supportsCash && supportsPoints && <OrSeparator />}

                {supportsPoints && (
                  <DataWithLabel
                    className="flex-wrap gap-y-1"
                    label="اجمالي النقاط"
                    labelClassName=" text-sm"
                    data={`${(item.quantity || 1) * item.points_price} نقطة`}
                    dataClassName=" text-sm"
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
