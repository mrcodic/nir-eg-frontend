import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/CustomImage";
import { StoreItem } from "@/types/store.types";
import { motion } from "framer-motion";
import Link from "next/link";
import StoreItemCartAddRemove from "./StoreItemCartAddRemove";
import BuyStoreItemTrigger from "./BuyStoreItemTrigger";
import StoreItemCardBadge, { ItemBadgeVariants } from "./StoreItemCardBadge";

const MotionCard = motion.create(Card);
const MotionLink = motion.create(Link);

const StoreItemCard = ({ book }: { book: StoreItem }) => {
  const notAvailable = book?.status === 1;

  return (
    <MotionCard
      viewport={{
        once: true,
        margin: "-10px",
      }}
      initial={{
        opacity: 0.5,
        y: 10,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      className="group flex h-full flex-col border-none bg-transparent shadow-none"
    >
      <MotionLink
        href={"/store/" + book?.id}
        className="border-gray-light relative z-1 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg border"
        initial={{
          opacity: 0,
          y: "100%",
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          margin: "-10px",
        }}
        transition={{
          duration: 0.3,
        }}
      >
        {notAvailable && <StoreItemCardBadge text="غير متاح حاليًا" />}

        {book?.grade_name && (
          <StoreItemCardBadge
            variant={`grade-${book?.grade_id || "1"}` as ItemBadgeVariants}
            text={book?.grade_name}
            side="tr"
          />
        )}

        <CustomImage
          src={book?.image || "/assets/book.svg"}
          alt="book"
          fallback="/assets/grade-placeholder.png"
          fill
          className="z-1 rounded-lg object-cover transition-all group-hover:scale-105"
        />
      </MotionLink>

      <div
        className={`border-secondary relative -top-2 z-2 mx-auto w-[95%] grow rounded-xl border bg-white p-4 shadow-sm`}
      >
        <div className="flex flex-col gap-y-4">
          <CardTitle className="text-xl">{book?.name}</CardTitle>
          <CardContent className="p-0 text-[#454545] flex flex-wrap items-center gap-x-2">
            <span>{Number(book?.price).toFixed(2)} جنية</span>
            {book?.can_buy_points && book?.points_price !== null && (
              <>
                <span className="text-gray-400">أو</span>
                <span className="text-secondary font-bold">{book.points_price} نقطة</span>
              </>
            )}
          </CardContent>
        </div>

        {notAvailable ? (
          <CardFooter className="mt-4 justify-center p-0">
            غير متاح حاليًا
          </CardFooter>
        ) : (
          <CardFooter className="mx-auto mt-4 flex-wrap justify-center gap-x-4 gap-y-2 p-0">
            <BuyStoreItemTrigger
              item={book}
            />
            <StoreItemCartAddRemove item={book} />
          </CardFooter>
        )}
      </div>
    </MotionCard>
  );
};

export default StoreItemCard;
