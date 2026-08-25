export function Button({ children }: { children: React.ReactNode }) {
  return <button style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{children}</button>
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ border: '1px solid #eaeaea', borderRadius: 8, padding: 16, margin: '8px 0' }}><h3 style={{ margin: '0 0 8px' }}>{title}</h3>{children}</div>
}

export function Badge({ label }: { label: string }) {
  return <span style={{ padding: '2px 8px', background: '#eee', borderRadius: 12, fontSize: 12 }}>{label}</span>
}

export function Spinner() {
  return <div style={{ width: 20, height: 20, border: '2px solid #ccc', borderTopColor: '#0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>spin</div>
}

export function Table({ rows }: { rows: string[][] }) {
  return <table style={{ borderCollapse: 'collapse', width: '100%' }}><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ border: '1px solid #ddd', padding: 8 }}>{c}</td>)}</tr>)}</tbody></table>
}