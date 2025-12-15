import { cn, numberToArabicOrdinal } from "@/lib/utils";
import Image from "next/image";

function SideNavLink({
  index,
  isAnswer,
  question,
  fieldAnswered,
}: {
  index: number;
  isAnswer: boolean;
  question: any;
  fieldAnswered: boolean | null;
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
        "w-full rounded-lg text-[16px] p-2 flex items-center gap-4 text-[#121212] text-right   font-bold",
        btnStyles
      )}
      onClick={(e) => handleClick(e, `#question-${index}`)}
    >
      <Image
        src="/assets/question.svg"
        width={24}
        height={24}
        alt=""
        className={isAnswer ? "brightness-0 invert" : ""}
      />
      <span>{`السؤال ${numberToArabicOrdinal(index + 1)}`}</span>
    </button>
  );
}

export default SideNavLink;
