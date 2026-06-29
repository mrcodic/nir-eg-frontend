"use client";

import NextTopLoader from "nextjs-toploader";

const MyComponent = ({ primary }: { primary: string }) => {
  return (
    <NextTopLoader
      color={primary || "#2E77AE"}
      initialPosition={0.08}
      crawlSpeed={200}
      height={4}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      zIndex={9999999}
      showAtBottom={false}
    />
  );
};

export default MyComponent;
