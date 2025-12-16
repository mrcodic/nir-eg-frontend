"use client";

import NextTopLoader from "nextjs-toploader";

const MyComponent = () => {
  const primary = process.env.NEXT_PUBLIC_TEMPLATE_COLOR;
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
