import { unstable_cache } from 'next/cache'
import { cache } from 'react'

export default async function Page({ params }) {
  const { domain: domainName, slug } = await params
  console.log('Page render', domainName, slug)
  const unestableData = await getUnestableData({ domainName, slug })
  const data = await getData({ domainName, slug })

  return <>
    <div>Page:</div>
    <hr />
    <div>Unestable Cached Data</div>
    <div dangerouslySetInnerHTML={{ __html: unestableData }} />
    <hr />
    <div>Cached Data</div>
    <div dangerouslySetInnerHTML={{ __html: data }} />
  </>
}

const getUnestableData = unstable_cache(async ({ domainName, slug }) => {
  return `
    domain: ${domainName} <br>
    slug: ${slug} <br>
    time: ${Date.now()} <br>
  `
})

const getData = cache(async ({ domainName, slug }) => {
  return `
    domain: ${domainName} <br>
    slug: ${slug} <br>
    time: ${Date.now()} <br>
  `
})
