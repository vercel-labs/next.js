export const dynamic = 'force-dynamic'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function RootLayout({ children }) {
  const t0 = Date.now()
  console.log(`[layout] render start t=${t0}`)
  await sleep(300)
  console.log(`[layout] render end   t=${Date.now()} (started ${t0})`)
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
