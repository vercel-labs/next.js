import { unstable_noStore as noStore } from "next/cache";
export default async function P() {
  await new Promise((r) => setTimeout(r, 10));
  noStore();
  return <p>after-await {Date.now()}</p>;
}
