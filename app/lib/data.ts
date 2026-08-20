export const data_in_memory = [
  { id: "1", value: "item 1" },
  { id: "2", value: "item 2" },
];

export async function fetchItems() {
  console.log(`fetchItems: array length ${data_in_memory.length}`);
  return data_in_memory;
}
