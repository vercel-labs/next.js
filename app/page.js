import cache from "../lib/cache";

export const dynamic = "force-dynamic";

export default function Page() {
  const id = cache.getId();
  console.log("[app/page] cache id =", id);
  return <p>Current ID: {id}</p>;
}
