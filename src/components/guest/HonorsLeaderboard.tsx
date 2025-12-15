import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import DataWithLabel from "../ui/DataWithLabel";
import StyledText from "../ui/StyledText";

const students = [
  { name: "Ahmed Hassan", points: 120 },
  { name: "Sara Mahmoud", points: 95 },
  { name: "Omar Khaled", points: 230 },
  { name: "Laila Tarek", points: 180 },
  { name: "Mostafa Adel", points: 75 },
  { name: "Reem Samir", points: 210 },
  { name: "Hassan Mohamed", points: 60 },
  { name: "Yara Ibrahim", points: 155 },
  { name: "Karim Fathy", points: 140 },
  { name: "Farah Youssef", points: 200 },
  { name: "Mahmoud Reda", points: 170 },
  { name: "Nour El Din", points: 250 },
];

function HonorsLeaderboard() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex justify-center items-center">
        <Image src="/assets/rank.gif" width={64} height={64} alt="rank medal" />

        <StyledText text="لوحة شرف 2025" className="text-32" />
      </div>

      <div className="grid max-lg:justify-items-center lg:grid-cols-2 xl:grid-cols-3 gap-12">
        {students.map((student, index) => (
          <StudentCard student={student} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}

export default HonorsLeaderboard;

const StudentCard = ({
  student,
  rank,
}: {
  student: { name: string; points: number };
  rank: number;
}) => {
  const isRankOne = rank === 1;
  return (
    <Card
      className={cn(
        "relative lg:py-6 lg:px-8 px-6 py-4 rounded-lg max-lg:w-full lg:max-w-[564px] border-primary-100 hover:border-secondary hover:bg-background transition-all",
        {
          "col-span-full lg:mx-auto lg:min-w-[564px] shrink-0": isRankOne,
        }
      )}
    >
      <CardContent
        className={cn("flex justify-between p-0 gap-6", {
          "flex-col items-center w-full": !isRankOne,
          "max-lg:flex-col max-lg:items-center max-lg:w-full": isRankOne,
        })}
      >
        <div
          className={cn("flex items-center gap-4", {
            "border-b border-secondary pb-2 justify-center w-full": !isRankOne,
            "max-lg:border-b max-lg:border-secondary max-lg:pb-2 max-lg:justify-center max-lg:w-full":
              isRankOne,
          })}
        >
          <h4 className="font-bold md:text-2xl text-lg">{student.name}</h4>
          <Image
            src={isRankOne ? "/assets/rank.gif" : "/assets/confetti-solid.gif"}
            width={48}
            height={48}
            alt="rank medal"
            className="md:size-12 size-8"
          />
        </div>

        <DataWithLabel
          label="الدرجة"
          data={student.points}
          dataClassName="text-xl md:text-3xl"
        />
      </CardContent>

      <div className="absolute lg:-top-8 lg:-left-8 -left-6 -top-6 lg:size-16 size-12 rounded-full border border-secondary bg-primary-radial flex items-center justify-center">
        <span className="font-bold text-2xl lg:text-4xl text-white ">
          {rank}
        </span>
      </div>
    </Card>
  );
};
