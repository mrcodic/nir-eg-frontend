"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";

const PLACEHOLDER_TENANTS = [
  {
    id: "1",
    teacherName: "مستر اسلام سلامة",
    avatar: "/assets/instructor-photo.svg",
  },
  {
    id: "2",
    teacherName: "مستر اسلام سلامة",
    avatar: "/assets/instructor-photo.svg",
  },
  {
    id: "3",
    teacherName: "مستر اسلام سلامة",
    avatar: "/assets/instructor-photo.svg",
  },
];

export default function UserTenantSwitch() {
  const [open, setOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(
    PLACEHOLDER_TENANTS[0]?.id ?? "",
  );

  return (
    <DropdownMenu dir="rtl" modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="border-primary-100 group hover:bg-primary-800 relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all focus:outline-hidden">
        <div
          className={cn(
            "bg-primary-800 me-px h-6 w-5 mask-center mask-no-repeat transition-all group-hover:bg-white",
          )}
          style={{
            maskImage: "url(/assets/icons/up-down.svg)",
            maskSize: "contain",
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mobile:top-1 border-gray-light relative left-10 z-100 w-[368px] rounded-lg border bg-white p-0 shadow-md">
        <div className="border-gray-light flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-xs font-medium text-black">اختر مدرس</h3>
          <button
            type="button"
            className="bg-gray-light text-gray-dark flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
            aria-label="close"
            onClick={() => setOpen(false)}
          >
            <X className="size-3" />
          </button>
        </div>

        <ScrollArea
          dir="rtl"
          className="w-full py-2 **:data-radix-scroll-area-viewport:max-h-[min(281px,calc(100dvh-220px))]"
        >
          <div className="px-4">
            <div className="divide-gray-light divide-y">
              {PLACEHOLDER_TENANTS.map((tenant) => {
                const selected = selectedTenantId === tenant.id;
                return (
                  <DropdownMenuItem
                    key={tenant.id}
                    onClick={() => setSelectedTenantId(tenant.id)}
                    onSelect={(e) => e.preventDefault()}
                    className={cn(
                      "hover:bg-primary-50 focus:bg-primary-50 flex w-full cursor-pointer items-center justify-between gap-2 rounded-none px-4 py-1.5 text-right transition-colors",
                      selected && "bg-primary-50/30",
                    )}
                  >
                    <Image
                      src={tenant.avatar}
                      alt={tenant.teacherName}
                      width={30}
                      height={31}
                      className="h-[31px] w-[30px] rounded-lg object-cover"
                    />
                    <p className="text-sm font-normal text-[#41474B]">
                      {tenant.teacherName}
                    </p>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </div>
        </ScrollArea>
        <div className="mt-2 px-4 pb-2">
          <Button className="h-8 w-full max-w-full rounded-lg px-2 text-sm font-bold">
            تأكيد
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
