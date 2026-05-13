import SubbedCourses from "@/modules/courses/components/SubbedCourses";

function page() {
  return (
    <div className="mt-[120px] mb-12 grow space-y-[50px] group-data-[template=landing-v3]/template:mt-[140px] md:space-y-[100px]">
      <SubbedCourses />
    </div>
  );
}

export default page;
