// Invalid: `openGraph.type` is not a valid value; the Next.js TS plugin reports
// ts(71008) "The Next.js \"metadata\" export should be type of \"Metadata\" from \"next\"."
export const metadata = {
  openGraph: { type: 'nope' },
}

export default function Page() {
  return <h1>Hello</h1>
}
