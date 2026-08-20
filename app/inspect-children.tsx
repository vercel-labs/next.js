import { isValidElement, type ReactNode } from 'react'

function describe(node: any): string {
  if (!isValidElement(node)) return `non-element(${String(node)})`
  const t: any = (node as any).type
  const name =
    typeof t === 'string'
      ? t
      : t?.displayName ||
        t?.name ||
        t?.$$typeof?.toString?.() ||
        (t && typeof t === 'object' ? JSON.stringify(Object.keys(t)) : String(t))
  return `<${name}> key=${JSON.stringify((node as any).key)}`
}

export default function InspectChildren({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const list = Array.isArray(children) ? children : [children]
  return (
    <div>
      <pre id={`inspect-${label}`} data-inspect={label}>
        {label}: {list.map(describe).join(' | ')}
      </pre>
      {children}
    </div>
  )
}
