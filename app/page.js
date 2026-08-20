import Link from 'next/link'
const cases = ['variable', 'weight400', 'weightlist', 'optional']
export default function Page() {
  return (
    <ul>
      {cases.map((c) => (
        <li key={c}>
          <Link href={`/${c}`}>{c}</Link>
        </li>
      ))}
    </ul>
  )
}
