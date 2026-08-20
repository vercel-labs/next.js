import { googleInter, localInter } from './fonts'

const SAMPLE = 'a 0123 ({[i]}) 1/2'

function Row({ label, font }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ font: '600 16px system-ui', margin: '0 0 8px' }}>{label}</h2>
      <p
        data-testid={`${label}-off`}
        style={{
          fontFamily: font.style.fontFamily,
          fontSize: 56,
          margin: 0,
          fontFeatureSettings: 'normal',
          display: 'inline-block',
        }}
      >
        {SAMPLE}
      </p>
      <br />
      <p
        data-testid={`${label}-on`}
        style={{
          fontFamily: font.style.fontFamily,
          fontSize: 56,
          margin: 0,
          fontFeatureSettings: '"ss01" 1, "ss02" 1, "zero" 1, "cv05" 1',
          display: 'inline-block',
        }}
      >
        {SAMPLE}
      </p>
    </section>
  )
}

export default function Page() {
  return (
    <main>
      <Row label="google" font={googleInter} />
      <Row label="local" font={localInter} />
    </main>
  )
}
