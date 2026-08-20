'use client'

export default function Home() {
  let debugme = 0
  debugme = 1 // <-- breakpoint here (render)
  const onClick = () => {
    const clicked = debugme + 1 // <-- breakpoint here (event handler)
    console.log('clicked', clicked)
  }
  return (
    <main>
      <h1>debug me</h1>
      <button id="btn" onClick={onClick}>click</button>
    </main>
  )
}
