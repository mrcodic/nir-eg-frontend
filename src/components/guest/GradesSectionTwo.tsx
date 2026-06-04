import { getServerData } from "@/helpers/fetchers/server-fetch";
import { Grade } from "@/types";
import Link from "next/link";
import CustomImage from "../ui/CustomImage";
import SectionTitle from "./SectionTitle";

const GradesSectionTwo = async () => {
  const grades = await getServerData<{ data: Grade[] }>({
    queryKey: ["grades"],
    isAuth: false,
  });

  if (!grades?.data?.length) return null;

  return (
    <section id="grades" className="scroll-m-32">
      <SectionTitle title="الكورسات" />

      <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {grades?.data?.map((grade) => (
          <Link
            href={`/bundles?grade=${grade.id}`}
            key={grade.id}
            className="group w-full max-w-[300px] cursor-pointer overflow-hidden md:max-w-[500px]"
          >
            {/* Image Placeholder */}
            <div className="relative h-64 w-full overflow-hidden rounded-xl transition-all hover:bg-gray-400">
              <CustomImage
                src={grade?.image || "/assets/grade-placeholder.png"}
                fill
                fallback="/assets/grade-placeholder.png"
                className="-z-1"
                alt="grade type image"
                fetchPriority="high"
                loading="eager"
              />
            </div>

            {/* Footer */}
            <div className="bg-primary-800 group-hover:bg-primary-800/90 mt-6 rounded-xl p-4 text-white transition-colors">
              <div className="relative inline-block">
                <h3 className="text-xl font-bold">{grade.name}</h3>
                <span className="absolute right-0 -bottom-1 h-[3px] w-8 rounded-full bg-[#f59e0b]"></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default GradesSectionTwo;
