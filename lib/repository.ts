import { unstable_cache } from "next/cache";

let l1Calls = 0;
let l2Calls = 0;

// LEVEL 2 (inner): expensive, cached for 1 hour.
const getAllCars = unstable_cache(
  async () => {
    l2Calls++;
    console.log(`L2 MISS: getAllCars invoked (${l2Calls} total)`);
    return { items: [{ id: 1, make: "Ford" }], readAt: now() };
  },
  ["getAllCars"],
  { revalidate: 3600, tags: ["fullDatasetTag"] }
);

// LEVEL 1 (outer): cheap, cached for 5 seconds.
const getCarById = unstable_cache(
  async (id: number) => {
    l1Calls++;
    console.log(`L1 MISS: getCarById invoked (${l1Calls} total)`);
    const all = await getAllCars();
    return { id, l2ReadAt: all.readAt, l1ReadAt: now() };
  },
  ["getCarById"],
  { revalidate: 5, tags: ["carIdsTag"] }
);

export async function report() {
  return { car: await getCarById(1), l1Calls, l2Calls };
}

export function now(): string {
  return new Date().toISOString().slice(11, 23);
}
