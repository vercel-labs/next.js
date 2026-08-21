'use client'
import { useEffect, useState } from 'react'
export default function Marks() {
  const [data, setData] = useState(null)
  useEffect(() => {
    setTimeout(() => {
      setData({
        marks: performance.getEntriesByType('mark').map((e) => e.name),
        measures: performance.getEntriesByType('measure').map((e) => e.name),
      })
    }, 500)
  }, [])
  return <pre id="app-timings">{data ? JSON.stringify(data, null, 2) : 'collecting'}</pre>
}
