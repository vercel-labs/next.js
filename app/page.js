import { Nanum_Gothic_Coding } from 'next/font/google'

// Fetched by next/font/google with its hardcoded macOS user agent.
const googleFont = Nanum_Gothic_Coding({
  weight: '700',
  subsets: ['latin'],
  display: 'block',
})

const SAMPLE = 'Hamburgefonstiv 0123456789 illegible'

export default function Page() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <style>{`
        @font-face {
          font-family: 'NanumWindowsUA';
          src: url('/fonts/nanum-gothic-coding-700-windows-ua.woff2') format('woff2');
          font-weight: 700;
          font-display: block;
        }
        @font-face {
          font-family: 'NanumMacUA';
          src: url('/fonts/nanum-gothic-coding-700-macos-ua.woff2') format('woff2');
          font-weight: 700;
          font-display: block;
        }
        .row { border-bottom: 1px solid #ddd; padding: 8px 0; }
        .label { font: 12px/1.4 monospace; color: #666; }
        .sample { font-weight: 700; }
      `}</style>
      <h1 style={{ fontSize: 18 }}>
        next/font/google strips TTF hinting (issue #78118)
      </h1>
      {[13, 16, 24].map((size) => (
        <div key={size}>
          <div className="row">
            <div className="label">
              next/font/google (macOS UA, unhinted) @ {size}px
            </div>
            <div
              className={`sample ${googleFont.className}`}
              style={{ fontSize: size }}
            >
              {SAMPLE}
            </div>
          </div>
          <div className="row">
            <div className="label">
              same Google woff2 fetched with a Windows UA (hinted) @ {size}px
            </div>
            <div
              className="sample"
              style={{ fontFamily: 'NanumWindowsUA', fontSize: size }}
            >
              {SAMPLE}
            </div>
          </div>
        </div>
      ))}
    </main>
  )
}
