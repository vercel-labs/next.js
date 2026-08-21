import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  _props: {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMeta = await parent
  const icons = parentMeta.icons ?? {}
  return {
    icons: {
      ...icons,
      apple: [{ url: '/child-apple-icon.png' }],
    },
  }
}

export default function Page() {
  return <h1>hello</h1>
}
