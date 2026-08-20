import { bricolageAxes } from './font'

const rows = [
  ['a', 's', 'axes:["wdth"] — no CSS override'],
  ['b', 's v80', 'axes:["wdth"] + font-variation-settings:"wdth" 80.7'],
  ['c', 's v200', 'axes:["wdth"] + font-variation-settings:"wdth" 200'],
  ['d', 's st75', 'axes:["wdth"] + font-stretch:75%'],
] as const

export default function Page() {
  return (
    <main className={bricolageAxes.variable} style={{ padding: 24 }}>
      <h1 style={{ font: '14px monospace' }}>axes: [&apos;wdth&apos;]</h1>
      {rows.map(([id, cls, label]) => (
        <div key={id} style={{ marginBottom: 12 }}>
          <div style={{ font: '12px monospace', color: '#666' }}>{label}</div>
          <span id={id} className={cls}>Hamburgefonstiv</span>
        </div>
      ))}
    </main>
  )
}
