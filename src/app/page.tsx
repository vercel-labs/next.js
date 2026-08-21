"use client"
import { testAction } from "./actions"
import { useState } from "react"

export default function Home() {
  const [result, setResult] = useState<string>("not called yet")

  async function handleClick() {
    try {
      const res = await testAction()
      setResult(JSON.stringify(res))
    } catch (e: any) {
      setResult("ERROR: " + e.message)
    }
  }

  return (
    <div>
      <h1>Server Action Test</h1>
      <button onClick={handleClick}>Call Server Action</button>
      <pre>{result}</pre>
    </div>
  )
}
