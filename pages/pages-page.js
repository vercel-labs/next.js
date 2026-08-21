import { useEffect, useState } from 'react'
export default function PagesPage() {
  const [data, setData] = useState(null)
  useEffect(() => {
    setTimeout(() => {
      setData({
        marks: performance.getEntriesByType('mark').map((e) => e.name),
        measures: performance.getEntriesByType('measure').map((e) => e.name),
      })
    }, 500)
  }, [])
  return (
    <main>
      <h1 id="pages-heading">Pages Router page</h1>
      <pre id="pages-timings">{data ? JSON.stringify(data, null, 2) : 'collecting'}</pre>
    </main>
  )
}
