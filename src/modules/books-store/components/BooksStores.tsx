import Empty from "@/components/Empty";
import RoomHeader from "@/components/RoomHeader";
import { BookLinksSettings } from "@/types/books.types";
import Image from "next/image";
import Link from "next/link";

export default function BooksStores({
  links,
}: {
  links: BookLinksSettings["links"];
}) {
  return (
    <section className="mt-12 min-h-[300px] py-8">
      <RoomHeader title="متاجر الكتب" icon="/assets/books-colored.svg" />

      {links.length ? (
        <BooksList links={links} />
      ) : (
        <Empty text="لا توجد متاجر متاحة." />
      )}
    </section>
  );
}

type LinkItem = { id: number | string; url: string };

function BooksList({ links }: { links: LinkItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((item) => (
        <BooksListItem key={String(item.id)} href={item.url} />
      ))}
    </ul>
  );
}

function BooksListItem({ href }: { href: string }) {
  return (
    <li
      className={`group bg-background border-primary flex flex-col justify-between gap-1 rounded-lg border p-4 transition-all group-hover:border-(--grade-color) hover:-translate-y-1`}
    >
      <Image
        src={"/assets/BookColor.svg"}
        width={48}
        height={48}
        alt="book icon"
      />
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-2"
        prefetch={false}
      >
        <span className="font-medium underline-offset-4 group-hover:underline">
          الذهاب الى المتجر
        </span>
        <span aria-hidden className="transition group-hover:translate-x-0.5">
          ↗
        </span>
      </Link>

      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm break-all">
        {href}
      </p>
    </li>
  );
}
