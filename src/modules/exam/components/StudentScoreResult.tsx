import ScoreBadge from "@/components/ui/ScoreBadge";
import ScorePercent from "@/components/ui/ScorePercent";

function StudentScoreResult({
  score,
  pass = true,
  pending,
}: {
  score: number;
  pass?: boolean;
  pending?: boolean;
}) {
  return (
    <div className="relative flex min-w-[116px] gap-2 text-lg font-bold text-nowrap sm:text-xl">
      <ScorePercent score={score} passed={pass} type="" />
      <ScoreBadge passed={pass} type="" pending={pending || score === null} />
    </div>
  );
}
// function StudentScoreResult({
//   score,
//   pass = true,
// }: {
//   score: number;
//   pass?: boolean;
// }) {
//   return (
//     <div className="relative font-bold  text-nowrap text-lg sm:text-xl">
//       {" "}
//       <h3
//         style={{
//           WebkitTextFillColor: "white",
//           WebkitTextStrokeWidth: 1,
//           WebkitTextStrokeColor: "#d9b45c",
//         }}
//         className="textStroke  absolute flex items-center -top-[2px]  z-0"
//       >
//         {" "}
//         {/* {score}% */}
//         {score + " "}اسئلة
//       </h3>
//       <h3
//         className={cn("flex items-center relative z-10 ", {
//           "text-[#B75050]": !pass,
//           "text-[#1EAD7B]": pass,
//         })}
//       >
//         {/* {score}% */}
//         {score + " "}اسئلة
//       </h3>
//     </div>
//   );
// }

export default StudentScoreResult;
