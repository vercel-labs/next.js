"use client";

import dynamic from "next/dynamic";

export const StockLabel = ({ slug }) => {
  // exactly as in the issue: dynamic() called inside the component body
  const StockValue = dynamic(
    () => import("./stock-value").then((mod) => mod.StockValue),
    { ssr: false, loading: () => <p>Loading...</p> }
  );

  return <StockValue slug={slug} />;
};
