"use client";
import Link from "next/link";
import { Card } from "./card";

export default function CrossList() {
  return (
    <div>
      <p>Cross-route shared layout: click the card to open /cross/detail</p>
      <Link id="open-detail" href="/cross/detail">
        <Card id="card" big={false} />
      </Link>
    </div>
  );
}
