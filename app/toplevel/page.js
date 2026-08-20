import { unstable_noStore as noStore } from "next/cache";

noStore();

async function getData() {
  return { now: Date.now() };
}

export default async function TopLevelPage() {
  const data = await getData();
  return <p>toplevel: {data.now}</p>;
}
