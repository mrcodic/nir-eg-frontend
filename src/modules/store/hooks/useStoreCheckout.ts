import { useModal } from "@/context/ModalProvider";
import { useCartStore } from "@/context/StoreProvider";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { getApiErrorMessage } from "@/helpers/get-api-error-message";
import { useToast } from "@/hooks/use-toast";
import { paymentType } from "@/types";
import { StoreItem } from "@/types/store.types";
import { redirectUrl } from "@/utils/clientFun";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type UseStoreCheckoutParams = {
  asModal: boolean;
  item?: StoreItem;
  paymentMethod: paymentType | "POINTS" | null;
  checkoutBlocked: boolean;
  hasEnoughPoints: boolean;
};

type PointsCheckoutBody =
  | {
      book_id: number;
      quantity: number;
    }
  | {
      items: {
        book_id: number;
        quantity: number;
      }[];
    };

function getPointsCheckoutBody({
  asModal,
  item,
  itemQuantity,
  items,
}: {
  asModal: boolean;
  item?: StoreItem;
  itemQuantity: number;
  items: StoreItem[];
}): PointsCheckoutBody {
  if (asModal) {
    if (!item) {
      throw new Error("لم يتم العثور على الكتاب المطلوب شراؤه");
    }

    return {
      book_id: item.id,
      quantity: itemQuantity || 1,
    };
  }

  return {
    items: items.map((cartItem) => ({
      book_id: cartItem.id,
      quantity: cartItem.quantity || 1,
    })),
  };
}

export function useStoreCheckout({
  asModal,
  item,
  paymentMethod,
  checkoutBlocked,
  hasEnoughPoints,
}: UseStoreCheckoutParams) {
  const router = useRouter();
  const { toast } = useToast();
  const modal = useModal();
  const queryClient = useQueryClient();
  const { cartId, items, getItemQuantity, clearCart } = useCartStore();
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);

  const completePointsCheckout = useCallback(async () => {
    toast({ icon: "success", description: "تمت عملية الشراء بالنقاط بنجاح" });

    try {
      await clearCart();
    } catch (error) {
      toast({
        icon: "error",
        description: getApiErrorMessage(
          error,
          "تمت عملية الشراء، لكن تعذر تحديث السلة.",
        ),
      });
    }

    queryClient.invalidateQueries({ queryKey: ["/students/profile"] });

    if (asModal) {
      modal.closeModal();
      return;
    }

    console.log(redirectUrl({ booksPage: true })[0]);
    router.push(redirectUrl({ booksPage: true })[0]);
  }, [asModal, clearCart, modal, queryClient, router, toast]);

  const checkoutWithPoints = useCallback(async () => {
    if (!hasEnoughPoints) {
      toast({
        description: "رصيد نقاطك غير كافٍ لإتمام عملية الشراء.",
        icon: "error",
      });
      return;
    }

    await mutateClient("/store/purchase-points", {
      body: getPointsCheckoutBody({
        asModal,
        item,
        itemQuantity: item ? getItemQuantity(String(item.id)) : 0,
        items,
      }),
    });
    await completePointsCheckout();
  }, [
    asModal,
    completePointsCheckout,
    getItemQuantity,
    hasEnoughPoints,
    item,
    items,
    toast,
  ]);

  const checkoutWithMoney = useCallback(async () => {
    const [success_url, failure_url] = redirectUrl(
      asModal ? { itemId: item?.id } : { booksPage: true },
    );
    const response = await mutateClient("/cart/pay", {
      body: {
        ...(asModal ? { book_id: item?.id } : { cart_id: cartId }),
        payment_method: paymentMethod,
        success_url,
        failure_url,
      },
    });

    if (!response?.payment_url) {
      throw new Error("حصل مشكله اثناء الدفع");
    }

    router.push(response.payment_url);
    toast({ icon: "loading", description: "جاري التوجه لبوابة الدفع" });

    if (asModal) {
      modal.closeModal();
    }
  }, [asModal, cartId, item?.id, modal, paymentMethod, router, toast]);

  const checkout = useCallback(async () => {
    if (!paymentMethod || checkoutBlocked) return;

    setIsCheckoutPending(true);

    try {
      if (paymentMethod === "POINTS") {
        await checkoutWithPoints();
      } else {
        await checkoutWithMoney();
      }
    } catch (error) {
      toast({
        description: getApiErrorMessage(error, "حصل مشكله اثناء الدفع"),
        icon: "error",
      });
    } finally {
      setIsCheckoutPending(false);
    }
  }, [
    checkoutBlocked,
    checkoutWithMoney,
    checkoutWithPoints,
    paymentMethod,
    toast,
  ]);

  return { checkout, isCheckoutPending };
}
