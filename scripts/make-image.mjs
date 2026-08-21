// Generates public/big.jpg. Deliberately noisy so it does not compress away:
// the transform has to stay in flight long enough for step 1 to abort it.
// `sharp` ships as a dependency of `next`, so there is nothing extra to install.
import { mkdir, stat } from 'node:fs/promises'
import sharp from 'sharp'

const WIDTH = 6000
const HEIGHT = 4000
const OUT = 'public/big.jpg'

const pixels = Buffer.allocUnsafe(WIDTH * HEIGHT * 3)
for (let i = 0; i < pixels.length; i++) pixels[i] = (i * 2654435761) % 251

await mkdir('public', { recursive: true })
await sharp(pixels, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
  .jpeg({ quality: 98 })
  .toFile(OUT)

const { size } = await stat(OUT)
console.log(`${OUT}: ${(size / 1048576).toFixed(1)} MB (${WIDTH}x${HEIGHT})`)
