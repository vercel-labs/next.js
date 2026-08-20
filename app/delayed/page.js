import { unstable_noStore as noStore } from "next/cache";
async function getSession() {
  await new Promise((r) => setTimeout(r, 50));
  return { user: { id: "1" } };
}
export default async function P() {
  noStore();
  const s = await getSession();
  return <p>delayed {s.user.id} {Date.now()}</p>;
}
