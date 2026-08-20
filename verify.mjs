// Requests the optimized image WITHOUT `Accept: image/webp` (like Safari 13.1,
// crawlers, or CDNs that strip the Accept header) and inspects the result.
import sharp from 'sharp'

const base = process.env.BASE_URL || 'http://localhost:3000'
const url = `${base}/_next/image?url=%2Ftransparent.webp&w=256&q=75`

for (const accept of ['image/webp,image/*,*/*', 'image/png,image/*,*/*']) {
  const res = await fetch(url, { headers: { accept } })
  const buf = Buffer.from(await res.arrayBuffer())
  const meta = await sharp(buf).metadata()
  // sample the top-left corner, which is fully transparent in the source
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
  const px = [...data.slice(0, info.channels)]
  console.log(`accept: ${accept}`)
  console.log(`  content-type: ${res.headers.get('content-type')}`)
  console.log(`  format: ${meta.format} hasAlpha: ${meta.hasAlpha} channels: ${info.channels}`)
  console.log(`  top-left pixel: ${JSON.stringify(px)}`)
}
