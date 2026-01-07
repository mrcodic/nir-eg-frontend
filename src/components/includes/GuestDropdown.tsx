import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

function GuestDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="mobile:hidden flex size-10 items-center justify-center rounded-lg bg-white shadow-md">
          <img src="/assets/burgerIcon.svg" className=" " />
        </button>
      </DropdownMenuTrigger>
      {/* w-[calc(100vw-32px)] sm:ms-[7.5vw] sm:w-[85vw] md:ms-[calc(10vw+16px)] md:w-[calc(80vw-32px)] */}
      <DropdownMenuContent
        className={cn(
          "mobile:hidden flex w-full min-w-[200px] flex-col gap-2 p-2 group-data-[template=landing-v3]/template:ms-4 group-data-[template=landing-v3]/template:mt-5",
          // {
          //   "ms-4 mt-5": template == 3,
          // },
        )}
      >
        <Link
          href={"/login"}
          className="mx-auto flex w-full items-center justify-center rounded-[10px] border border-[#523412] bg-[#523412] p-2 text-center font-bold text-white outline-offset-1 outline-red-500"
        >
          <DropdownMenuItem> تسجيل دخول </DropdownMenuItem>
        </Link>

        <Link
          href={"/register"}
          className="mx-auto flex w-full items-center justify-center rounded-[10px] border border-[#523412] bg-transparent p-2 text-center text-[18px] font-bold text-[#523412]"
        >
          <DropdownMenuItem> إنشاء حساب</DropdownMenuItem>
        </Link>

        <div className="border-gray-light flex w-full items-center justify-center gap-2 rounded-[10px] border p-2 md:hidden">
          <Link href="/#grades" className="flex w-full justify-center">
            <DropdownMenuItem>
              <h3>الصفوف الدراسية</h3>
              <img
                className="h-[32px] w-[32px]"
                src="/assets/books-colored.svg"
              />
            </DropdownMenuItem>
          </Link>
        </div>

        {/* <WrapperHOC queryKey={["settings/books"]}>
          {({ data }: { data: { data: BookLinksSettings } }) => {
            const booksData = data?.data;
            if (!booksData?.links?.length) return null;

            return (
              <div className="border flex w-full  items-center justify-center gap-2 rounded-[10px] border-gray-light p-2">
                <Link href="/books" className="w-full flex justify-center">
                  <DropdownMenuItem>
                    <h3>الكتب</h3>
                    <img
                      className="w-[32px] h-[32px]"
                      src="/assets/BookColor.svg"
                    />
                  </DropdownMenuItem>
                </Link>
              </div>
            );
          }}
        </WrapperHOC> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GuestDropdown;
