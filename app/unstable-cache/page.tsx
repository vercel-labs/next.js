import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic"; // route runs per request; only the cached fn should be cached

const getData = unstable_cache(
  async () => {
    console.log("[repro] unstable_cache miss -> computing");
    return new Date().toISOString();
  },
  ["repro-uc"],
  { revalidate: 10 }
);

export default async function Page() {
  const cached = await getData();
  return (
    <main>
      <p>cached-at: {cached}</p>
      <p>now: {new Date().toISOString()}</p>
    </main>
  );
}
