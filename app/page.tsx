export default function Home() {
  const qs = 'a+b=c&plain=ok&third+space=test+value'
  return (
    <main>
      <h1>Middleware rewrite duplicates query params whose key contains a space</h1>
      <ul>
        <li>
          <a href={`/buggy/x?${qs}`}>buggy (rewrite as-is)</a>
        </li>
        <li>
          <a href={`/fixed/x?${qs}`}>fixed (re-encoded query)</a>
        </li>
        <li>
          <a href={`/target-page?${qs}`}>target-page directly (no middleware)</a>
        </li>
      </ul>
    </main>
  )
}
