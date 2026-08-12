type Params = Promise<{ a: string; b: string }>

export async function generateStaticParams() {
  return [{ a: 'x', b: 'y' }]
}

export async function generateMetadata({ params }: { params: Params }) {
  // Reading a route param is dynamic in a fallback shell, where the params
  // promise hangs because at least one param is a fallback param.
  const { a } = await params
  return { title: a }
}

// The page itself doesn't read any request-time data, so the shell prelude is
// full, which is what arms the dynamic metadata mistake-detection check.
export default function Page() {
  return <main id="body">static body</main>
}
