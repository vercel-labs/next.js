"use client";
import { useRouter } from "next/navigation";
export default function SignInPage() {
  const router = useRouter();
  return (
    <div>
      <h1 id="full-page">FULL SIGNIN PAGE</h1>
      <button id="push-same" onClick={() => router.push("/signin", { scroll: false })}>
        push /signin again
      </button>
    </div>
  );
}
