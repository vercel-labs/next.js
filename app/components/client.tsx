'use client'

export function ClientComponent({
  data,
  children,
}: {
  data: unknown
  children: React.ReactNode
}) {
  return <div data-client>{children}</div>
}

export function InternalClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const type = String((children as any)?.$$typeof)
  console.log('[InternalClientComponent] children.$$typeof =', type)
  return (
    <div>
      <p id="child-type">{type}</p>
      {children}
    </div>
  )
}
