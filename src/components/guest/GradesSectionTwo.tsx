import { getServerData } from "@/helpers/server-fetch";
import { Grade } from "@/types";
import Link from "next/link";
import SectionTitle from "./Ui/SectionTitle";

const GradesSectionTwo = async () => {
  const grades = await getServerData<{ data: Grade[] }>({
    queryKey: ["grades"],
    isAuth: false,
  });

  if (!grades?.data?.length) return null;

  return (
    <section id="grades">
      <SectionTitle title="الكورسات" />

      <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
        {grades?.data?.map((grade) => (
          <Link
            href={`/bundles?grade=${grade.id}`}
            key={grade.id}
            className="group w-full cursor-pointer overflow-hidden max-md:max-w-96"
          >
            {/* Image Placeholder */}
            <div className="h-64 w-full rounded-xl bg-gray-300 transition-all hover:bg-gray-400"></div>

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
