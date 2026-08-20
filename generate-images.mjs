// Generates fixture images with zero dependencies (minimal PNG encoder),
// so the reproduction runs with just `npm install`.
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function png(width, height, pixel) {
  const raw = Buffer.alloc(height * (1 + width * 3))
  let o = 0
  for (let y = 0; y < height; y++) {
    raw[o++] = 0 // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixel(x, y)
      raw[o++] = r
      raw[o++] = g
      raw[o++] = b
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 6 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
// deterministic pseudo random noise so the images do not compress away
const rnd = (s) => {
  s = (s * 1664525 + 1013904223) >>> 0
  return s % 256
}

mkdirSync('images/icons', { recursive: true })
for (let i = 1; i <= 100; i++) {
  writeFileSync(
    `images/icons/icon${i}.png`,
    png(64, 64, (x, y) => [rnd(x * 7919 + y * 104729 + i), (x * i) % 256, (y * i) % 256])
  )
}
writeFileSync(
  'images/photo.png',
  png(1600, 1200, (x, y) => [rnd(x * 31 + y * 7), (y * 5) % 256, (x + y) % 256])
)
console.log('generated images/photo.png and 100 icons in images/icons')
