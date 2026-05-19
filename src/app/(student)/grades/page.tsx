import RoomHeader from "@/modules/rooms/components/RoomHeader";
import ActivitiesTable from "@/components/tables/ActivitiesTable";
import { getTenantSettingsServer } from "@/services/tenantServices";
import { redirect } from "next/navigation";
import { Animate } from "@/components/shared/Animate";

const Grades = async () => {
  const tenantSettings = await getTenantSettingsServer();

  if (!tenantSettings?.features?.student_gradebook) {
    return redirect("/");
  }

  return (
    <section className="wrapper mt-[140px] mb-10">
      <Animate preset="slideDown">
        <RoomHeader title="الدرجات" icon="/assets/assignment-colored.svg" />
      </Animate>
      <Animate preset="slideUp" delay={0.2}>
        <ActivitiesTable />
      </Animate>
    </section>
  );
};
export default Grades;
