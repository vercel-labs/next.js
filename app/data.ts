export type Record = { id: string; name: string; blob: string; tags: string[] };

export function makeDataset(count: number) {
  const records: Record[] = [];
  for (let i = 0; i < count; i++) {
    records.push({
      id: `record-${i}`,
      name: `Record number ${i} with a reasonably long human readable name`,
      blob: "x".repeat(1700),
      tags: ["alpha", "beta", "gamma", "delta", `tag-${i}`],
    });
  }
  return records;
}
