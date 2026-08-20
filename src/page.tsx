import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import type { NextPage } from 'next'

const Page: NextPage = () => (
  <>
    <Head>
      <title>repro</title>
    </Head>
    <Link href="/">home</Link>
    <Image src="/a.png" alt="a" width={1} height={1} />
  </>
)

export default Page
