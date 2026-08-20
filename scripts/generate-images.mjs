// Creates 60 large source JPEGs in public/ so the optimizer must do real work.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

await mkdir('public', { recursive: true })
for (let i = 0; i < 60; i++) {
  const big = i < 3
  await sharp({
    create: {
      width: big ? 4000 : 2500,
      height: big ? 3000 : 1800,
      channels: 3,
      noise: { type: 'gaussian', mean: 100 + (i % 50), sigma: 50 },
    },
  })
    .jpeg({ quality: 90 })
    .toFile(`public/photo${i}.jpg`)
}
console.log('generated 60 images in public/')
