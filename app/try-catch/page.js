import { unstable_noStore as noStore } from "next/cache";
export default async function P() {
  try {
    noStore();
  } catch (e) {
    console.log("caught", e);
  }
  return <p>try-catch {Date.now()}</p>;
}
