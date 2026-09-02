import { Suspense } from 'react'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: Props) {
  'use cache'

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PageContent {...props} />
    </Suspense>
  )
}

async function PageContent(props: Props) {
  const { slug } = await props.params

  return <p id="slug">{slug}</p>
}
