export default async function Page({ params }: { params: Promise<{ locale: string; eventId: string; cartId: string }> }) {
  const { locale, eventId, cartId } = await params
  return (
    <div>
      <h1>{locale} {eventId} {cartId}</h1>
      <iframe src="about:blank" title="Payment" />
    </div>
  )
}
