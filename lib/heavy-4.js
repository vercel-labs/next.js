// ~150MB resident at import time — simulates a large module graph's footprint.
export const data4 = Array.from({ length: 1_200_000 }, (_, i) => ({
  id: i, key: 'k' + i, pad: 'x'.repeat(64),
}));
export const sum4 = data4.length;
