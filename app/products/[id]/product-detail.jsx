"use client";
import Link from "next/link";

export default function ProductDetail({ data }) {
  return (
    <main>
      <Link href="/products">back</Link>
      <h1 id="title">{data?.title}</h1>
      <h3>${(data?.price).toFixed(2)}</h3>
      <p>{data?.description}</p>
    </main>
  );
}
