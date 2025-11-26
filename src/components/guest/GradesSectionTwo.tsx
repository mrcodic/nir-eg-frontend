import SectionTitle from "./Ui/SectionTitle";

const grades = [
  {
    id: 1,
    title: "الصف الثالث الثانوي",
  },
  {
    id: 2,
    title: "الصف الثاني الثانوي",
  },
  {
    id: 3,
    title: "الصف الأول الثانوي",
  },
];

const GradesSectionTwo = () => {
  return (
    <section id="grades">
      <SectionTitle title="الكورسات" />

      <div className="mt-8 grid grid-cols-1 gap-6  md:grid-cols-3">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="group cursor-pointer overflow-hidden  "
          >
            {/* Image Placeholder */}
            <div className="h-64 w-full bg-gray-300 transition-colors hover:bg-gray-400 rounded-xl"></div>

            {/* Footer */}
            <div className="bg-primary-800 mt-6 rounded-xl p-4  text-white transition-colors group-hover:bg-primary-800/90">
              <div className="relative inline-block ">
                <h3 className="text-xl font-bold">{grade.title}</h3>
                <span className="absolute -bottom-1 right-0 h-[3px] w-8 rounded-full bg-[#f59e0b]"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default GradesSectionTwo;
