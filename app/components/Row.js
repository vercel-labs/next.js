const weights = [400, 500, 600, 700, 800, 900]

export default function Row({ label, className }) {
  return (
    <main data-case={label}>
      <h3 style={{ font: '14px monospace' }}>{label}</h3>
      {weights.map((w) => (
        <div key={w} className={className} style={{ fontWeight: w, whiteSpace: 'nowrap' }}>
          <span data-measure={`${label}-${w}`}>Hamburgefonstiv 123</span>
        </div>
      ))}
    </main>
  )
}
