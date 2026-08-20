"use server";

import { data_in_memory } from "./data";
import { revalidatePath } from "next/cache";

export async function nop() {}

export async function createItem() {
  const length_before = data_in_memory.length;
  data_in_memory.push({ id: String(Date.now()), value: "item (added)" });
  const length_after = data_in_memory.length;
  console.log(`createItem: array length ${length_before} -> ${length_after}`);
  revalidatePath("/");
}

export async function deleteItem() {
  const length_before = data_in_memory.length;
  if (data_in_memory.length === 0) {
    throw new Error("Cannot remove item from empty array!");
  }
  data_in_memory.pop();
  const length_after = data_in_memory.length;
  console.log(`deleteItem: array length ${length_before} -> ${length_after}`);
  revalidatePath("/");
}
