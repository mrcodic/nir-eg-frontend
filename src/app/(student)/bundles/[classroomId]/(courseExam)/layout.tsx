"use client";

import { TaskProvider } from "@/context/TaskProvider";

function layout({ children }) {
  return <TaskProvider taskType={"exam"}>{children}</TaskProvider>;
}

export default layout;
