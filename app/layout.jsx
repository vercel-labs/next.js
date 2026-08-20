export const metadata = { title: 'sync script hydration repro' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Synchronous, render-blocking third-party-style script (A/B testing tool).
            It runs while the document is being parsed, before React hydrates. */}
        <script src="/ab-sync.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
