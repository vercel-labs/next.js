export const config = { runtime: 'edge' }

export default function handler() {
  return Response.json({
    base64: Buffer.from('hello edge').toString('base64'),
    nonce: Buffer.from(crypto.randomUUID()).toString('base64'),
    isBuffer: Buffer.isBuffer(Buffer.from('a')),
    byteLength: Buffer.byteLength('héllo', 'utf8'),
    ctorName: Buffer.name,
  })
}
