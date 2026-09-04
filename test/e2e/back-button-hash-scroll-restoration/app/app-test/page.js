import Link from 'next/link'

export default function Page() {
  return (
    <>
      <div style={{ height: 800 }}>spacer top</div>
      <h2 id="anchor">anchor element (app router)</h2>
      <div style={{ height: 3000 }}>spacer</div>
      <p>
        <Link id="to-another" href="/app-another">
          Open another page
        </Link>
      </p>
      <div style={{ height: 2000 }}>spacer bottom</div>
    </>
  )
}
