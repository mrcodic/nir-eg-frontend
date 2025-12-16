"use client";

import { getCurrentTemplateColor } from "@/helpers/template.helpers";
import { useEffect } from "react";

function useTemplateColor() {
  const color = getCurrentTemplateColor(); // "0 100% 50%"

  useEffect(() => {
    const [h, s, l] = color.split(" ");

    const root = document.documentElement;
    root.style.setProperty("--primary-h", h);
    root.style.setProperty("--primary-s", s);
    root.style.setProperty("--primary-l", l);
  }, [color]);

  return { color };
}

export default useTemplateColor;
