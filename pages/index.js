import { identity as vendorIdentity } from 'vendor-lib'
import { identity as srcIdentity } from '../src/lib.js'

export default function Home() {
  if (typeof window !== 'undefined') {
    window.__out = [vendorIdentity(window.a, window.b), srcIdentity(window.a, window.b)]
  }
  return <p>repro</p>
}
