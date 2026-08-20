import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

// NextRequest#headers is a WHATWG Headers object, not a plain object
const headers = new Headers({ 'accept-language': 'en-US,en;q=0.5' })
const languages = new Negotiator({ headers }).languages()
console.log('Headers instance ->', JSON.stringify(languages))
try {
  console.log(match(languages, ['en-US', 'nl-NL', 'nl'], 'en-US'))
} catch (e) {
  console.log('match() threw:', e.message)
}

const plain = { 'accept-language': 'en-US,en;q=0.5' }
console.log('plain object ->', JSON.stringify(new Negotiator({ headers: plain }).languages()))
