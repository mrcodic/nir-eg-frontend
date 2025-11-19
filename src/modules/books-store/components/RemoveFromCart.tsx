"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/BooksStoreProvider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const RemoveFromCart = ({
  children,
  navigate,
  className,
  id,
}: {
  children: React.ReactNode;
  navigate?: boolean;
  className?: string;
  id: string;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleRemoveFromCart = () => {
    try {
      removeFromCart(id);
      if (navigate) {
        router.push("/books/cart");
      }
    } catch (error) {
      toast({
        icon: "error",
        description: "حدث خطاء اثناء ازاله الكتاب من السله",
      });
    }
  };

  return (
    <Button onClick={handleRemoveFromCart} className={className}>
      {children}
    </Button>
  );
};

export default RemoveFromCart;
