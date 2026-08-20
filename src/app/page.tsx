'use client'
export default function Page() {
  const value = 1 + 1 // set a breakpoint here
  return <button onClick={() => console.log(value)}>value {value}</button>
}
