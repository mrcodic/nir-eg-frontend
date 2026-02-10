import RoomHeader from "@/components/RoomHeader";
import ActivitiesTable from "@/components/tables/ActivitiesTable";
import { getTenantSettingsServer } from "@/services/tenantServices";
import { redirect } from "next/navigation";

const Grades = async () => {
  const tenantSettings = await getTenantSettingsServer();

  if (!tenantSettings?.features?.student_gradebook) {
    return redirect("/");
  }

  return (
    <section className="wrapper mt-[140px] mb-10">
      <RoomHeader title="الدرجات" icon="/assets/assignment-colored.svg" />
      <ActivitiesTable />
    </section>
  );
};
export default Grades;
