import { bricolagePlain } from './font'

const rows = [
  ['a', 's', 'no axes — no CSS override'],
  ['b', 's v80', 'no axes + font-variation-settings:"wdth" 80.7'],
  ['c', 's v200', 'no axes + font-variation-settings:"wdth" 200'],
  ['d', 's st75', 'no axes + font-stretch:75%'],
] as const

export default function Page() {
  return (
    <main className={bricolagePlain.variable} style={{ padding: 24 }}>
      <h1 style={{ font: '14px monospace' }}>no axes option</h1>
      {rows.map(([id, cls, label]) => (
        <div key={id} style={{ marginBottom: 12 }}>
          <div style={{ font: '12px monospace', color: '#666' }}>{label}</div>
          <span id={id} className={cls}>Hamburgefonstiv</span>
        </div>
      ))}
    </main>
  )
}
