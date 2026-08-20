import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
export default function R() {
  const router = useRouter()
  useEffect(() => { router.replace('/nav') }, [router])
  return (
    <>
      <h1>priority image then immediate client redirect</h1>
      <Image src="/ball.png" alt="a" width={400} height={400} priority />
    </>
  )
}
