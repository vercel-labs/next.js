"use client";
import Link from "next/link";
import { Card } from "../card";

export default function CrossDetail() {
  return (
    <div>
      <p>Detail. <Link href="/cross">back</Link></p>
      <Card id="card" big={true} />
    </div>
  );
}
