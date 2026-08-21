// ~150MB resident at import time — simulates a large module graph's footprint.
export const data7 = Array.from({ length: 1_200_000 }, (_, i) => ({
  id: i, key: 'k' + i, pad: 'x'.repeat(64),
}));
export const sum7 = data7.length;
