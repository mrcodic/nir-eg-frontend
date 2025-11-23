import Image from "next/image";
import { ReactNode } from "react";

function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: string | ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Image
        src="/assets/books-colored.svg"
        className="size-[38px]"
        width={38}
        height={38}
        alt="books"
      />
      <div>
        <h3 className="text-2xl font-bold">{title}</h3>
        {typeof description === "string" ? (
          <p className="font-bold mt-1 text-gray-dark">{description}</p>
        ) : (
          description
        )}
      </div>
    </div>
  );
}

export default AuthHeader;
