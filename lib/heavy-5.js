// ~150MB resident at import time — simulates a large module graph's footprint.
export const data5 = Array.from({ length: 1_200_000 }, (_, i) => ({
  id: i, key: 'k' + i, pad: 'x'.repeat(64),
}));
export const sum5 = data5.length;
