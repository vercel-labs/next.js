// Regenerates the fixtures in app/images/.
// `sharp-avif.avif` has major brand "avif" (works).
// `mif1.avif` is the same bytes with major brand "mif1" (real-world brand used by
// Apple/Photoshop/libheif exporters, with "avif" in compatible brands) -> reproduces the bug.
const fs = require('fs')
const sharp = require('sharp')

sharp({
  create: { width: 64, height: 64, channels: 3, background: { r: 200, g: 60, b: 60 } },
})
  .avif({ quality: 50 })
  .toBuffer()
  .then((buf) => {
    fs.writeFileSync('app/images/sharp-avif.avif', buf)
    const mif1 = Buffer.from(buf)
    mif1.write('mif1', 8, 'latin1') // patch ftyp major brand only
    fs.writeFileSync('app/images/mif1.avif', mif1)
  })
