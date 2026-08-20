"use server";

export async function addItem(id: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 300));
  console.log("[server action] addItem", id);
  return `added:${id}`;
}
