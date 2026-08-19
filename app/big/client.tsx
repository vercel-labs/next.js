"use client";
export default function Client({ data }: { data: string[] }) {
  return <ul>{data.map((d, i) => <li key={i}>{d}</li>)}</ul>;
}
