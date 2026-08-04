import { getMdxContent } from '../get-mdx-content'

export default async function Page() {
  const Content = await getMdxContent('hello')

  return (
    <main>
      <Content />
    </main>
  )
}
