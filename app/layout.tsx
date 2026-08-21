import Toggle from "./toggle"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: 24 }}>
        <h1>#76272 repro — interactivity during streaming</h1>
        {/* client component in the layout, OUTSIDE any Suspense boundary */}
        <Toggle />
        {children}
      </body>
    </html>
  )
}
