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
      <div className="flex items-center justify-center">
        <Image
          src="/assets/gifs/rank.gif"
          width={64}
          height={64}
          alt="rank medal"
        />

        <StyledText text="لوحة شرف 2025" className="text-32" />
      </div>

      <div className="grid gap-12 max-lg:justify-items-center lg:grid-cols-2 xl:grid-cols-3">
        {students.map((student, index) => (
          <StudentCard key={index} student={student} rank={index + 1} />
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
        "border-primary-100 hover:border-secondary hover:bg-background relative rounded-lg px-6 py-4 transition-all max-lg:w-full lg:max-w-[564px] lg:px-8 lg:py-6",
        {
          "col-span-full shrink-0 lg:mx-auto lg:min-w-[564px]": isRankOne,
        },
      )}
    >
      <CardContent
        className={cn("flex justify-between gap-6 p-0", {
          "w-full flex-col items-center": !isRankOne,
          "max-lg:w-full max-lg:flex-col max-lg:items-center": isRankOne,
        })}
      >
        <div
          className={cn("flex items-center gap-4", {
            "border-secondary w-full justify-center border-b pb-2": !isRankOne,
            "max-lg:border-secondary max-lg:w-full max-lg:justify-center max-lg:border-b max-lg:pb-2":
              isRankOne,
          })}
        >
          <h4 className="text-lg font-bold md:text-2xl">{student.name}</h4>
          <Image
            src={
              isRankOne
                ? "/assets/gifs/rank.gif"
                : "/assets/gifs/confetti-solid.gif"
            }
            width={48}
            height={48}
            alt="rank medal"
            className="size-8 md:size-12"
          />
        </div>

        <DataWithLabel
          label="الدرجة"
          data={student.points}
          dataClassName="text-xl md:text-3xl"
        />
      </CardContent>

      <div className="border-secondary bg-primary-radial absolute -top-6 -left-2 flex size-12 items-center justify-center rounded-full border lg:-top-8 lg:-left-8 lg:size-16">
        <span className="text-2xl font-bold text-white lg:text-4xl">
          {rank}
        </span>
      </div>
    </Card>
  );
};
