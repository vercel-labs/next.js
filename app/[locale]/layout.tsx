export default function LocaleLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div>
      <h1>locale layout</h1>
      {children}
      {modal}
    </div>
  )
}
