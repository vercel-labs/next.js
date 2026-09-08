import Link from 'next/link'
import { ServerId } from '../../components/server-id'

export default function Page() {
  return (
    <>
      <ServerId label="other-page" />
      <Link href="/" id="to-home">
        Back to /
      </Link>
    </>
  )
}
