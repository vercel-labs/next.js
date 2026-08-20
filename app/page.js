"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const data = { name: "John", number: 40 };
  return (
    <div>
      <h1>home</h1>
      <button id="push" onClick={() => { router.push("/blog", data); }}>
        push /blog with object
      </button>
    </div>
  );
}
