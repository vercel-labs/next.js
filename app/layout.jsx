import Counter from './counter'

// The client component is the point: it gives every page's
// client-reference-manifest real entries, and it lives in the layout so each
// page's manifest is a merge rather than an empty object.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Counter />
        {children}
      </body>
    </html>
  )
}
