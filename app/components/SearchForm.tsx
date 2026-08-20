"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export default function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const buildQs = () => {
    const sp = new URLSearchParams();
    if (inputRef.current?.value) sp.set("search", inputRef.current.value);
    const qs = sp.toString();
    return (qs ? "?" : "") + qs;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          window.history.pushState(null, "", buildQs());
        });
      }}
    >
      <input ref={inputRef} name="search" placeholder="Search" defaultValue={searchParams.get("search") || ""} />
      <button type="submit" id="pushstate">pushState in transition</button>
      <button
        type="button"
        id="routerpush"
        onClick={() => {
          startTransition(() => {
            router.push(pathname + buildQs());
          });
        }}
      >
        router.push in transition
      </button>
      <span id="pending">{isPending ? "PENDING" : "IDLE"}</span>
    </form>
  );
}
