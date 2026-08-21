"use client";

import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { useRouter } from "next/navigation";

export const Link = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <a
      href={href}
      style={{ padding: "50px", backgroundColor: "red"}}
      onMouseEnter={() => setTimeout(() => router.prefetch(href, { kind: PrefetchKind.FULL }), 2000)}
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
    >
      {children}
    </a>
  );
};
