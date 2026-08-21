const fetchWithRequest = () => {
  const req = new Request('https://example.com', {
    mode: 'no-cors',
    method: 'POST',
    body: '',
  })
  return fetch(req)
}

const fetchWithoutRequest = () => {
  return fetch('https://example.com', {
    mode: 'no-cors',
    method: 'POST',
    body: '',
  })
}

export const generateStaticParams = async () => {
  if (process.env.REPRO_MODE === 'without-request') {
    await fetchWithoutRequest()
  } else {
    await fetchWithRequest()
  }
  return []
}

export default async function Page({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params
  return <div>pageId: {pageId}</div>
}
