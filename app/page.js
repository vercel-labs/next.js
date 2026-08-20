export const dynamic = 'force-dynamic'
export default function Page() {
  return <pre>node runtime MY_SECRET: {String(process.env.MY_SECRET)}</pre>
}
