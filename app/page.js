import { Lato, Ubuntu, Open_Sans } from 'next/font/google'

const lato = Lato({ weight: '400', subsets: ['latin'], display: 'block' })
const ubuntu = Ubuntu({ weight: '400', subsets: ['latin'], display: 'block' })
const openSans = Open_Sans({ subsets: ['latin'], display: 'block' })
const nextFonts = { lato, ubuntu, 'open-sans': openSans }

const TEXT = 'Hamburgefonstiv quick brown fox 0123'
const SIZES = [15, 16, 17]

function Block({ name, label, family }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ font: '11px monospace', color: '#999' }}>{`${name} / ${label}`}</div>
      {SIZES.map((size) => (
        <div
          key={size}
          data-testid={`${name}--${label}--${size}`}
          style={{ fontFamily: family, fontWeight: 400, fontSize: size, lineHeight: '30px', width: 700 }}
        >
          {TEXT}
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <>
      <style>{Object.keys(nextFonts)
        .flatMap((n) => ['nextfont-ua', 'windows-ua'].map(
          (v) => `@font-face{font-family:'${n}-${v}';src:url('/${n}-${v}.woff2') format('woff2');font-display:block}`
        ))
        .join('\n')}</style>
      <main style={{ padding: 20 }}>
        {Object.entries(nextFonts).map(([name, font]) => (
          <section key={name}>
            <Block name={name} label="next-font-google" family={font.style.fontFamily} />
            <Block name={name} label="raw-nextfont-ua" family={`'${name}-nextfont-ua'`} />
            <Block name={name} label="raw-windows-ua" family={`'${name}-windows-ua'`} />
          </section>
        ))}
      </main>
    </>
  )
}
