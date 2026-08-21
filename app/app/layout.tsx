"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  parallel: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  console.log(segment);
  return <>{children}</>;
}
