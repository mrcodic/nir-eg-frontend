import Link from "next/link";
import CustomImage from "../ui/CustomImage";

function ParentPortalNavbar() {
  return (
    <header className="bg-background data-[aria-hidden='true']:pointer-events-auto!s z-30 flex h-20 w-full items-center border-b aria-hidden:pointer-events-auto!">
      <nav className="wrapper flex items-center justify-between">
        <Link href={`/`} className="flex gap-2 self-end">
          <CustomImage
            src={"/logo.svg"}
            fallback="/logo.svg"
            width={110}
            height={48}
            unoptimized
            className="h-12 w-[110px] object-contain object-right"
            loading="eager"
            fetchPriority="high"
            alt="logo"
            priority
          />
        </Link>
      </nav>
    </header>
  );
}

export default ParentPortalNavbar;
