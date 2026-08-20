export const dynamic = 'force-dynamic'

// A long (>1024 chars) server-rendered string forces React Flight to emit it as a
// length-prefixed text row ("T<id>,<hexByteLength>") in the RSC payload.
const LONG = 'LONG_ENCRYPTED_' + 'A'.repeat(2000)

export default function Other() {
  return <p id="other">{LONG}</p>
}
