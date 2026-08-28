import { GoogleTagManager } from '@next/third-parties/google'

export default function Page() {
  return (
    <main>
      <h1>GoogleTagManager default script url</h1>
      <p id="status">Check the injected script src below.</p>
      <GoogleTagManager gtmId="GTM-XYZ123" />
    </main>
  )
}
