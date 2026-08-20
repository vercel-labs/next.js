"use client";

import { redirectPrivate, redirectPrivateSuspense } from "../actions";
import { useRouter } from "next/navigation";

export default function RedirectButton() {
  const router = useRouter();
  return (
    <>
      <button
        onClick={() => {
          redirectPrivate();
        }}
      >
        Redirect to private through server action
      </button>
      <button
        onClick={() => {
          router.push("/private");
        }}
      >
        Redirect to private through client router
      </button>
      <button
        onClick={() => {
          redirectPrivateSuspense();
        }}
      >
        Redirect to private page with suspense around cookies through server
        action
      </button>
    </>
  );
}
