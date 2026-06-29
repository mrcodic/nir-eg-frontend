"use client";

import { TaskProvider } from "@/context/TaskProvider";
import { usePathname } from "next/navigation";

function Layout({ children }) {
  const pathname = usePathname();
  const taskType = pathname.includes("exams") ? "exam" : "assignment";

  return <TaskProvider taskType={taskType}>{children}</TaskProvider>;
}

export default Layout;
