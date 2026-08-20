// Repro for https://github.com/vercel/next.js/issues/65560
//
// `output: 'export'` + a dynamic route with generateStaticParams whose segment
// config opts out of caching (`revalidate = 0`).
//
// `next build` exits 0 and prints
//   ● /blog/[slug]
//       ├ /blog/a
//       └ /blog/b
// but `out/` contains no HTML for /blog/a or /blog/b, and the page component is
// never rendered for those params. Internally the final export pass exports the
// literal route path `/blog/[slug]` instead (params.slug === '%5Bslug%5D').
export const revalidate = 0

export async function generateStaticParams() {
  console.log('generateStaticParams called')
  return [{ slug: 'a' }, { slug: 'b' }]
}

export default async function Page({ params }) {
  console.log('PAGE RENDER with params:', JSON.stringify(params))
  return <div>blog {String(params.slug)}</div>
}
