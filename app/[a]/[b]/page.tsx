type Params = Promise<{ a: string; b: string }>

export const generateStaticParams = async () => {
  return [{ a: 'x', b: 'y' }]
}

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { a, b } = await params
  return { title: a, alternates: { canonical: `/${b}` } }
}

export default function Page() {
  return <main>static body</main>
}
