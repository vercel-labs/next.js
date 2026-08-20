import { unstable_noStore as noStore } from "next/cache";

async function getData() {
  return { now: Date.now() };
}

export default async function InsidePage() {
  noStore();
  const data = await getData();
  return <p>inside: {data.now}</p>;
}
