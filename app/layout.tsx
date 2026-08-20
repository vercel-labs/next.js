export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <div id="modal-slot">{modal}</div>
      </body>
    </html>
  )
}
