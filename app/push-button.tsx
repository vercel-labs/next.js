"use client";
import { useRouter } from "next/navigation";

export function PushButton() {
  const router = useRouter();
  return (
    <button id="push-command" onClick={() => router.push("/command")}>
      open command
    </button>
  );
}
