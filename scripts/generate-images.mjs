// Generates large (4096x4096 noise) jpegs in public/ so that optimizing them
// takes a few seconds, which makes the abort window easy to hit.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const COUNT = Number(process.env.COUNT || 12)
const SIZE = 4096
const dir = path.join(process.cwd(), 'public')
fs.mkdirSync(dir, { recursive: true })

const raw = Buffer.allocUnsafe(SIZE * SIZE * 3)
for (let i = 0; i < raw.length; i++) raw[i] = Math.floor(Math.random() * 256)
const base = await sharp(raw, { raw: { width: SIZE, height: SIZE, channels: 3 } })
  .jpeg({ quality: 90 })
  .toBuffer()

for (let i = 0; i < COUNT; i++) {
  const file = path.join(dir, `img-${i}.jpg`)
  if (!fs.existsSync(file)) fs.writeFileSync(file, base)
}
console.log(`[setup] ${COUNT} x ${SIZE}x${SIZE} jpegs ready in public/ (${base.length} bytes each)`)
