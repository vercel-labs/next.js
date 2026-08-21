import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <main>
      <h2 id="a">1. YouTubeEmbed params="autoplay=1"</h2>
      <div id="case-autoplay">
        <YouTubeEmbed videoid="ogfYd705cRs" height={200} params="autoplay=1" />
      </div>

      <h2 id="b">2. YouTubeEmbed params="autoplay=1&amp;mute=1"</h2>
      <div id="case-autoplay-mute">
        <YouTubeEmbed videoid="ogfYd705cRs" height={200} params="autoplay=1&mute=1" />
      </div>

      <h2 id="d">4. YouTubeEmbed with muted prop (not in API)</h2>
      <div id="case-muted-prop">
        <YouTubeEmbed videoid="ogfYd705cRs" height={200} params="autoplay=1" muted />
      </div>

      <h2 id="c">3. Plain iframe control (autoplay + mute)</h2>
      <div id="case-plain">
        <iframe
          id="plain-iframe"
          height={200}
          src="https://www.youtube.com/embed/ogfYd705cRs?autoplay=1&mute=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media"
        />
      </div>
    </main>
  )
}
