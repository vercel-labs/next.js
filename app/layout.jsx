export default function RootLayout({ children, auth }) {
  // Conditional (slot) route: pretend the user is NOT logged in.
  const isLoggedIn = false

  return (
    <html lang="en">
      <body>{isLoggedIn ? children : auth}</body>
    </html>
  )
}
