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
            <div className="group/image relative h-64 w-full overflow-hidden rounded-xl transition-all">
              <CustomImage
                src={grade?.image}
                fill
                fallback="/assets/grade-placeholder.png"
                alt="grade type image"
                className="transition-all group-hover/image:scale-110"
                fetchPriority="high"
                loading="eager"
              />
            </div>

            {/* Footer */}
            <div className="bg-primary-800 group-hover:bg-primary-800/70 mt-6 rounded-xl p-4 text-white transition-all">
              <div className="relative inline-block">
                <h3 className="text-xl font-bold">{grade.name}</h3>
                <span className="bg-secondary absolute right-0 -bottom-1 h-[3px] w-8 rounded-full"></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default GradesSectionTwo;
