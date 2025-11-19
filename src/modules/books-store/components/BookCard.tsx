import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Book } from "@/types/books.types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import BookCartAddRemove from "./BookCartAddRemove";
import BuyBookTrigger from "./BuyBookTrigger";
import OutOfStockBadge from "./OutOfStockBadge";

const MotionCard = motion.create(Card);
const MotionLink = motion.create(Link);

const BookCard = ({ book }: { book: Book }) => {
  return (
    <MotionCard
      viewport={{
        once: true,
      }}
      initial={{
        opacity: 0.5,
        y: 10,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      className="bg-transparent group border-none shadow-none"
    >
      <MotionLink
        href={"/books/" + book?.id}
        className="h-[200px]  relative flex items-center  bg-background  justify-center w-full rounded-lg overflow-hidden "
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
          margin: "-20px",
        }}
        transition={{
          duration: 0.3,
        }}
      >
        {book?.status === 1 && <OutOfStockBadge />}
        <Image
          src={book?.image || "/assets/book.svg"}
          alt="book"
          width={160}
          height={160}
          className="group-hover:scale-105 transition-all rounded-lg"
        />
      </MotionLink>

      <div
        className={`relative  p-4 mx-auto -top-2 grow rounded-[8px] bg-white w-[95%]    border shadow-xs border-primary-700`}
      >
        <div className="flex flex-col gap-y-4">
          <CardTitle className="text-xl">{book?.name}</CardTitle>
          <CardContent className="p-0 text-[#454545]">
            {Number(book?.price).toFixed(2)} جنية
          </CardContent>
        </div>

        <CardFooter className="justify-center p-0 mt-4 flex-wrap gap-x-4 gap-y-2 mx-auto">
          <Suspense>
            <BuyBookTrigger
              id={book?.id}
              price={Number(book?.price)}
              name={book?.name}
            />
          </Suspense>
          <BookCartAddRemove book={book} />
        </CardFooter>
      </div>
    </MotionCard>
  );
};

export default BookCard;
