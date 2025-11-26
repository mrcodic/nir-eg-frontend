import Image from "next/image";
import StyledText from "../ui/StyledText";
import GradeCard from "./Ui/GradeCard";

const GradesData = [
  {
    title: "الصف الأول الثانوى",
    content: "محتويات الصف الأول",
    image: "/assets/grade-placeholder.png",
    id: 1,
    color: "#6C2932",
  },
  {
    title: "الصف الثاني الثانوى",
    content: "محتويات الصف الثاني",
    image: "/assets/grade-placeholder.png",
    id: 2,
    color: "#023E3E",
  },
  {
    title: "الصف الثالث الثانوى",
    content: "محتويات الصف الثالث",
    image: "/assets/grade-placeholder.png",
    id: 3,
    color: "#012D5A",
  },
];

const GradesSection = () => {
  return (
    <section className="py-3" id="grades">
      <div className="flex flex-col items-center mb-4 justify-center gap-2 text-center">
        <Image
          src="/assets/book-gif.gif"
          width={64}
          height={64}
          alt="book gif"
        />
        <StyledText
          as="h2"
          text="الفصول الدراسية"
          className=" font-bold text-32"
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]   gap-8 mt-8">
        {GradesData.map((grade, index) => {
          return <GradeCard key={index} grade={grade} />;
        })}
      </div>
    </section>
  );
};
export default GradesSection;
