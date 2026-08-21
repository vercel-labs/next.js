// Generates a large (~12 MB) noise JPEG at public/big.jpg.
// Noise defeats JPEG compression, so the file stays big and the internal
// source-image fetch streams long enough to abort mid-flight reliably.
const sharp = require('sharp')

const w = 4000
const h = 3000
const buf = Buffer.alloc(w * h * 3)
for (let i = 0; i < buf.length; i++) buf[i] = (Math.random() * 256) | 0

sharp(buf, { raw: { width: w, height: h, channels: 3 } })
  .jpeg({ quality: 95 })
  .toFile('public/big.jpg')
  .then((info) => console.log('public/big.jpg written:', info.size, 'bytes'))
