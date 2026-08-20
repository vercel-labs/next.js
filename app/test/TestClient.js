"use client"
import { useState, useEffect } from "react"
export function TestClient() {
  const [n, setN] = useState(0)
  useEffect(() => { console.log("v2 test client mounted", n) }, [n])
  return <button onClick={() => setN(n + 2)}>test client v2 counter: {n} extra padding string to change chunk contents and hash</button>
}
