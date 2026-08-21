let l1Calls = 0;
let l2Calls = 0;

async function getAllCarsUseCache() {
  "use cache";
  const { cacheLife } = await import("next/cache");
  cacheLife({ stale: 3600, revalidate: 3600, expire: 7200 });
  l2Calls++;
  console.log(`use cache L2 MISS (${l2Calls} total)`);
  return { readAt: now() };
}

async function getCarByIdUseCache(id: number) {
  "use cache";
  const { cacheLife } = await import("next/cache");
  cacheLife({ stale: 5, revalidate: 5, expire: 20 });
  l1Calls++;
  console.log(`use cache L1 MISS (${l1Calls} total)`);
  const all = await getAllCarsUseCache();
  return { id, l2ReadAt: all.readAt, l1ReadAt: now() };
}

export async function reportUseCache() {
  return { car: await getCarByIdUseCache(1), l1Calls, l2Calls };
}

function now(): string {
  return new Date().toISOString().slice(11, 23);
}
