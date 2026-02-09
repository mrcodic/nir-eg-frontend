import { getServerData } from "@/helpers/server-fetch";
import { Grade } from "@/types";
import Image from "next/image";
import StyledText from "../ui/StyledText";
import GradeCard from "./GradeCard";

const GradesSection = async () => {
  const grades = await getServerData<{ data: Grade[] }>({
    queryKey: ["grades"],
    isAuth: false,
  });

  console.log("grades : ", grades);

  if (!grades?.data?.length) return null;

  return (
    <section id="grades" className="scroll-m-16">
      <div className="mb-4 flex flex-col items-center justify-center gap-2 text-center">
        <Image
          src="/assets/gifs/book-gif.gif"
          width={64}
          height={64}
          alt="book gif"
        />
        <StyledText
          as="h2"
          text="الفصول الدراسية"
          className="text-32 font-bold"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
        {grades?.data?.map((grade, index) => {
          return <GradeCard key={index} grade={grade} />;
        })}
      </div>
    </section>
  );
};
export default GradesSection;
