import { cn, numberToArabicOrdinal } from "@/lib/utils";
// import Image from "next/image";

function SideNavLink({
  index,
  isAnswer,
  fieldAnswered,
}: {
  index: number;
  isAnswer: boolean;
  fieldAnswered: boolean | null;
  // question: any;
}) {
  const handleClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();

    const element = document.getElementById(hash.slice(1));

    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.replaceState(null, "", hash);
    }
  };

  let btnStyles = "";

  if (fieldAnswered !== null) {
    btnStyles = fieldAnswered
      ? isAnswer
        ? "bg-green-500 text-white"
        : "text-green-500  "
      : isAnswer
        ? "bg-red-600 text-white"
        : "text-red-600";
  }

  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 text-right text-base font-bold text-[#121212]",
        btnStyles,
      )}
      onClick={(e) => handleClick(e, `#question-${index}`)}
    >
      <div
        className={cn(
          "size-6 bg-red-500 mask-center mask-no-repeat object-contain transition-all group-hover:bg-white",
          {
            "bg-green-500": fieldAnswered,
            "bg-red-500": !fieldAnswered,
            "bg-white": isAnswer,
          },
        )}
        style={{
          maskImage: "url(/assets/question.svg)",
        }}
      />
      {/* <Image
        src="/assets/question.svg"
        width={24}
        height={24}
        alt=""
        className={isAnswer ? "brightness-0 invert" : ""}
      /> */}
      <span>{`السؤال ${numberToArabicOrdinal(index + 1)}`}</span>
    </button>
  );
}

export default SideNavLink;
