// Generates public/big.jpg: a ~21 MB, 6000x4000 noisy JPEG (a realistic
// "unoptimized hero image" upload) used as the optimizer's source.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const w = 6000
const h = 4000
const buf = Buffer.alloc(w * h * 3)
for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256)
await mkdir('public', { recursive: true })
await sharp(buf, { raw: { width: w, height: h, channels: 3 } })
  .jpeg({ quality: 92 })
  .toFile('public/big.jpg')
console.log('wrote public/big.jpg')
