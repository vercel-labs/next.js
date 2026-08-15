import Link from 'next/link'

export default function Page() {
  return (
    <ul>
      {['bitcoin', 'ethereum', 'solana'].map((id) => (
        <li key={id}>
          <Link id={`link-${id}`} href={`/coin/${id}`}>{id}</Link>
        </li>
      ))}
    </ul>
  )
}
