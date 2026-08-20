export default function handler(req, res) {
  if (global.gc) { global.gc(); global.gc() }
  const m = process.memoryUsage()
  res.json({ gc: !!global.gc, heapUsedMB: +(m.heapUsed / 1048576).toFixed(1), rssMB: +(m.rss / 1048576).toFixed(1), externalMB: +(m.external / 1048576).toFixed(1) })
}
