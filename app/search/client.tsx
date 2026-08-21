"use client";
import { useSearchParams } from "next/navigation";

export default function Client() {
  const searchParams = useSearchParams();
  return <p>token: {searchParams.get("token")}</p>;
}
