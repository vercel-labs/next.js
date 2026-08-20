// Standalone check: no Next.js server needed.
import { SignJWT } from 'jose'

const encodedKey = new TextEncoder().encode('super-secret-key-not-shared')
const token = await new SignJWT({
  userId: 'user_42',
  role: 'admin',
  email: 'secret@example.com',
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(encodedKey)

console.log('cookie value:', token)
const [header, payload] = token
  .split('.')
  .slice(0, 2)
  .map((p) => JSON.parse(Buffer.from(p, 'base64url').toString()))
console.log('header decoded without secret:', header)
console.log('payload decoded without secret:', payload)
console.log(
  'segments:',
  token.split('.').length,
  '(JWS/signed = 3, JWE/encrypted = 5)'
)
