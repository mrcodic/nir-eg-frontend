"use client";

import Empty from "@/components/shared/Empty";
import { Button } from "@/components/ui/button";
import useCopy from "@/hooks/useCopy";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { BookLinksSettings } from "@/types/store.types";
import { MoveUpLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BooksStores({
  links,
}: {
  links: BookLinksSettings["links"];
}) {
  if (!links.length) return null;
  return (
    <section className="mt-12 min-h-[300px] py-8">
      <RoomHeader title="متاجر الكتب" icon="/assets/books-colored.svg" />

      {links.length ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => (
            <BooksListItem key={String(item.id)} href={item.url} />
          ))}
        </ul>
      ) : (
        <Empty text="لا توجد متاجر متاحة." />
      )}
    </section>
  );
}

function BooksListItem({ href }: { href: string }) {
  const { copyToClipboard, copied } = useCopy();
  return (
    <li
      className={`bg-background border-primary flex w-full max-w-md flex-col justify-between gap-1 rounded-lg border p-4 transition-all max-sm:mx-auto`}
    >
      <Image
        src={"/assets/books-colored.svg"}
        width={48}
        height={48}
        alt="book icon"
      />

      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
        prefetch={false}
      >
        <Button className="group inline-flex w-full cursor-pointer items-center gap-2">
          <span className="font-medium underline-offset-4 group-hover:underline">
            الذهاب الى المتجر
          </span>
          <span
            aria-hidden
            className="transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <MoveUpLeft className="size-4" />
          </span>
        </Button>
      </Link>

      <Button variant="secondary" onClick={() => copyToClipboard(href)}>
        {copied ? "تم النسخ" : "نسخ رابط المتجر"}
      </Button>
    </li>
  );
}
