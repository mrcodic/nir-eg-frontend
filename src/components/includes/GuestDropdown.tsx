import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentTemplate } from "@/helpers/template.helpers";
import { cn } from "@/lib/utils";
import Link from "next/link";

function GuestDropdown() {
  const template = getCurrentTemplate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="size-10 rounded-lg bg-white shadow-md  flex justify-center items-center md:hidden  ">
          <img src="/assets/burgerIcon.svg" className=" " />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn("mobile:hidden w-full flex flex-col gap-2 p-2 ", {
          "w-[calc(100vw-32px)] sm:w-[85vw]  md:w-[calc(80vw-32px)] ms-4 sm:ms-[7.5vw] md:ms-[calc(10vw+16px)] mt-5":
            template == 3,
        })}
      >
        <Link
          href={"/login"}
          className="text-center font-bold w-full mx-auto flex justify-center items-center  bg-[#523412] p-2 border border-[#523412] outline-offset-1 outline-red-500 text-white   rounded-[10px]"
        >
          <DropdownMenuItem> تسجيل دخول </DropdownMenuItem>
        </Link>

        <Link
          href={"/register"}
          className="border text-center font-bold w-full mx-auto flex justify-center items-center bg-transparent p-2 text-[18px] text-[#523412]  border-[#523412]  rounded-[10px]"
        >
          <DropdownMenuItem> إنشاء حساب</DropdownMenuItem>
        </Link>

        <div className="border flex w-full  items-center justify-center gap-2 rounded-[10px] border-gray-light p-2">
          <Link href="/#grades" className="w-full flex justify-center">
            <DropdownMenuItem>
              <h3>الصفوف الدراسية</h3>
              <img className="w-[32px] h-[32px]" src="/assets/GradeColor.svg" />
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
