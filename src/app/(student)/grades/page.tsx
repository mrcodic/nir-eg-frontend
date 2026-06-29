import { Animate } from "@/components/shared/Animate";
import ActivitiesTable from "@/components/tables/ActivitiesTable";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { getTenantSettingsServer } from "@/services/tenant.service";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "الصفوف الدراسية",
  description: "تصفح الصفوف الدراسية المتاحة وانتقل إلى المحتوى المناسب لك.",
};

const Grades = async () => {
  const tenantSettings = await getTenantSettingsServer();

  if (!tenantSettings?.features?.student_gradebook) {
    redirect("/bundles");
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
