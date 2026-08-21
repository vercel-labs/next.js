export default function Post({ data, preview }) {
  // Unguarded access: if props are lost this throws, which is what #76138 reports.
  return (
    <main>
      <h1>Post</h1>
      <p id="preview">preview: {String(preview)}</p>
      <p id="data">data.title: {data.title}</p>
      <a id="enter" href="/api/preview?slug=/p/hello">Enter Preview Mode</a>
      <br />
      <a id="end" href="/api/end-preview?slug=/p/hello">End Preview</a>
    </main>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params, preview = false }) {
  console.log('[getStaticProps]', params.slug, 'preview =', preview)
  return {
    props: { preview, data: { title: (preview ? 'DRAFT ' : 'PUBLISHED ') + params.slug } },
  }
}
