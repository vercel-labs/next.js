import MyScript from './MyScript'

export default function Page() {
  return (
    <main>
      <h1>app router: beforeInteractive rendered 3x</h1>
      <MyScript />
      <MyScript />
      <MyScript />
      <p id="out">see window.__dupCount</p>
    </main>
  )
}
