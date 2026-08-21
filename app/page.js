import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <main>
      <h1>GoogleMapsEmbed directions mode</h1>
      <GoogleMapsEmbed
        apiKey="CHANGE_ME"
        height={200}
        width="100%"
        mode="directions"
        origin="Brooklyn+Bridge,New+York,NY"
        destination="Paris,France"
      />
    </main>
  )
}
