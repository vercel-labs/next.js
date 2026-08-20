// Approach from the docs (https://nextjs.org/docs/app/guides/self-hosting#graceful-shutdowns),
// adapted to the App Router as discussed in vercel/next.js#51404: register the
// handler at module scope of the root layout. No process.exit() here so we can
// observe whether Next keeps the process alive for the async cleanup.
if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  console.log('[layout] manual signal handling active')
  process.on('SIGTERM', () => {
    console.log('[layout] Received SIGTERM: cleaning up (no exit call)')
  })
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
