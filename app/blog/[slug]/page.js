import { getFilePath } from '../../../lib/paths'

export function generateStaticParams() {
  return [{ slug: 'post-a' }]
}

export default async function Page({ params }) {
  const { slug } = await params
  // fully dynamic path (comes from another module), like the issue report
  const filePath = getFilePath(slug)
  const { default: MDXContent } = await import(
    /* webpackExclude: /\.(mp4|js)$/ */
    `../../../content/${filePath}`
  )
  return (
    <main>
      <h1 id="ok">rendered</h1>
      <MDXContent />
    </main>
  )
}
