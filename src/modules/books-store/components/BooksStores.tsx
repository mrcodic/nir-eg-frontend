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
    <section className="min-h-[300px] mt-12 py-8">
      <RoomHeader title="متاجر الكتب" icon="/assets/BookColor.svg" />

      {links.length ? (
        <BooksList links={links} />
      ) : (
        <Empty text="لا توجد روابط متاحة." />
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
      className={`group bg-background transition-all   group-hover:border-(--grade-color)  hover:-translate-y-1  justify-between flex flex-col gap-1 p-4 border border-[#F8DEC5] rounded-lg`}
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
        className="inline-flex items-center gap-2 cursor-pointer"
        prefetch={false}
      >
        <span className="font-medium underline-offset-4 group-hover:underline">
          الذهاب الى المتجر
        </span>
        <span aria-hidden className="transition group-hover:translate-x-0.5">
          ↗
        </span>
      </Link>

      <p className="mt-2 break-all text-sm text-muted-foreground line-clamp-3">
        {href}
      </p>
    </li>
  );
}
