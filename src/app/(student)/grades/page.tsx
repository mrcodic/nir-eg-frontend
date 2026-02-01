"use client";

import RoomHeader from "@/components/RoomHeader";
import ActivitiesTable from "@/components/tables/ActivitiesTable";

const Grades = () => {
  return (
    <section className="wrapper mt-[140px] mb-10">
      <RoomHeader title="الدرجات" icon="/assets/assignment-colored.svg" />
      <ActivitiesTable />
    </section>
  );
};
export default Grades;
