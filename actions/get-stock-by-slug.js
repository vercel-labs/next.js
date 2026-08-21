"use server";

let calls = 0;

export async function getStockBySlug(slug) {
  calls++;
  console.log(`[server action] getStockBySlug(${slug}) call #${calls}`);
  await new Promise((r) => setTimeout(r, 1000));
  return 7;
}
