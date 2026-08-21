import Link from 'next/link'

export default function Home() {
  return <Link href="/start">start</Link>
}

// Reporter's case: getServerSideProps throws a plain object (not an Error).
export const getServerSideProps = async () => {
  throw { statusCode: 301 }
}
