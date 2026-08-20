// Regenerates big.wasm: a valid, ~1.25 MB WebAssembly module (incompressible data section)
// standing in for the WASM assets that Prisma/Arcjet-style libraries pull into Edge middleware.
const fs = require('fs')
const crypto = require('crypto')
const uleb = (n) => { const o = []; for (;;) { const b = n & 0x7f; n >>= 7; o.push(n ? b | 0x80 : b); if (!n) break } return Buffer.from(o) }
const data = crypto.randomBytes(1_250_000)
const pages = Math.ceil(data.length / 65536)
const sec = (id, body) => Buffer.concat([Buffer.from([id]), uleb(body.length), body])
const mem = sec(5, Buffer.concat([uleb(1), Buffer.from([0]), uleb(pages)]))
const name = Buffer.from('memory')
const exp = sec(7, Buffer.concat([uleb(1), uleb(name.length), name, Buffer.from([2]), uleb(0)]))
const dataSec = sec(11, Buffer.concat([uleb(1), Buffer.from([0x00, 0x41, 0x00, 0x0b]), uleb(data.length), data]))
const version = Buffer.alloc(4); version.writeUInt32LE(1)
fs.writeFileSync('big.wasm', Buffer.concat([Buffer.from('\0asm'), version, mem, exp, dataSec]))
