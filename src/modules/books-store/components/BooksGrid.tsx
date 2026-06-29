import { cn } from "@/lib/utils";
import { Book } from "@/types/books.types";
import BookCard from "./BookCard";

function BooksGrid({
  books,
  className,
}: {
  books: Book[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {books?.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BooksGrid;
