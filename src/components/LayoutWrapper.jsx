"use client";
import React from "react";
import { PagesProgressBar as ProgressBar } from "next-nprogress-bar";
const LayoutWrapper = ({ children }) => {
  return (
    <div>
      {children}
      <ProgressBar
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        options={{ showSpinner: false }}
      />
    </div>
  );
};

export default LayoutWrapper;
