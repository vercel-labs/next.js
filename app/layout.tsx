export default function RootLayout(props: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        {props.children}
        {props.modal}
      </body>
    </html>
  )
}
