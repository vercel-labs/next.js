import Script from 'next/script'

// Same component rendered multiple times in the tree.
export default function MyScript() {
  return <Script id="dup-script" src="/counter.js" strategy="beforeInteractive" />
}
