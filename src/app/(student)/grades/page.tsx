"use client";

import RoomHeader from "@/components/RoomHeader";
import ActivitiesTable from "@/components/tables/ActivitiesTable";

const Grades = () => {
  return (
    <section className="mt-[140px] mb-10 wrapper">
      <RoomHeader title="النقاط" icon="/assets/assignment-colored.svg" />
      <ActivitiesTable />
    </section>
  );
};
export default Grades;
