import { unstable_noStore as noStore } from "next/cache";
async function getSession() {
  noStore();
  await new Promise((r) => setTimeout(r, 50));
  return { user: { id: "1" } };
}
export default async function P() {
  const s = await getSession();
  return <p>nested {s.user.id} {Date.now()}</p>;
}
