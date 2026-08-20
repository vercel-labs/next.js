import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <main>
      <h1>GoogleMapsEmbed width=&quot;100%&quot; repro (issue #64831)</h1>
      {/* Exactly the snippet from the Next.js docs */}
      <GoogleMapsEmbed
        apiKey="XYZ"
        height={200}
        width="100%"
        mode="place"
        q="Brooklyn+Bridge,New+York,NY"
      />
    </main>
  )
}
