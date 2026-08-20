"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

type RevalidateButtonAppProps = {
  revalidate: string;
  type: "path" | "tag";
};

export function RevalidateButton({
  revalidate,
  type,
}: RevalidateButtonAppProps): JSX.Element {
  const pathname = usePathname();

  const [revalidation, setRevalidation] = useState("");

  function handleRevalidation(): void {
    const searchParams = new URLSearchParams();

    if (pathname) {
      searchParams.set("type", type);
      searchParams.set("revalidate", revalidate);
    }

    void fetch(`/api/revalidate?${searchParams.toString()}`).then(
      async (result) => {
        if (!result.ok) {
          setRevalidation("Fail to revalidate");

          return;
        }

        setRevalidation("Revalidated");
      }
    );
  }

  return (
    <div>
      <button onClick={handleRevalidation} type="button">
        Revalidate {type}
      </button>
      <div>{revalidation}</div>
    </div>
  );
}
