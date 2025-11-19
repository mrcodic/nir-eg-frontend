"use client";

import React, { useState } from "react";
import RoomHeader from "@/components/RoomHeader";
import ActivitiesTable from "@/components/tables/ActivitiesTable";

const Grades = () => {
  return (
    <div className="mt-[140px] mb-[40px] w-[85%] mx-auto">
      <RoomHeader title="الدرجات" icon="/assets/ExamsColor.svg" />
      <ActivitiesTable />
    </div>
  );
};
export default Grades;
