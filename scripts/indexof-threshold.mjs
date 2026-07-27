// Node/Undici's multipart parser locates the closing boundary with Buffer.indexOf.
// This low-RSS probe places a needle around the signed 32-bit offset boundary.
const limit = 2 ** 31
const needle = Buffer.from('nextjs-73220-closing-boundary')
const input = Buffer.allocUnsafe(limit + needle.length + 2)
input[0] = 0
for (const offset of [limit - 1, limit, limit + 1]) {
  needle.copy(input, offset)
  console.log(JSON.stringify({ offset, indexOf: input.indexOf(needle) }))
  input.fill(0, offset, offset + needle.length)
}
