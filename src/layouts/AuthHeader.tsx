import Image from "next/image";
import { ReactNode } from "react";

function AuthHeader({
  title,
  description,
  showIcon = true,
}: {
  title: string;
  description: string | ReactNode;
  showIcon?: boolean;
}) {
  return (
    <>
      <div className="flex gap-4">
        {showIcon && (
          <Image
            src="/assets/books-colored.svg"
            className="size-[38px]"
            width={38}
            height={38}
            alt="books"
          />
        )}
        <div>
          <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
          {typeof description === "string" ? (
            <p className="text-gray-dark mt-1 font-bold">{description}</p>
          ) : (
            description
          )}
        </div>
      </div>

      <div className="border-gray-light mt-4 h-1 w-full border border-double border-x-transparent" />
    </>
  );
}

export default AuthHeader;
