import { JSDOM } from 'jsdom'
// The import below globally augments Window with `[key: string]: any`,
// which collapses `Omit<Window, ...>` (used by @types/jsdom DOMWindow).
import { GoogleTagManager } from '@next/third-parties/google'

const dom = new JSDOM('<p>hi</p>')

// Expected: Document. Actual (with @next/third-parties imported): any
type DocType = typeof dom.window.document
type WindowKeys = keyof Window

// These assertions fail when the type collapses to `any`.
const assertDocument: DocType extends Document ? true : false = true
const assertKeysNotString: string extends WindowKeys ? false : true = true

export default function Page() {
  return <GoogleTagManager gtmId="GTM-XYZ" />
}
