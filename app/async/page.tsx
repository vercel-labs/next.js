"use client";
import Link from "next/link";
import { Card } from "../cross/card";

export default function AsyncList() {
  return (
    <div>
      <p>Cross-route shared layout where the target route is an async Server Component.</p>
      <Link id="open-detail" href="/async/detail">
        <Card id="card" big={false} />
      </Link>
    </div>
  );
}
