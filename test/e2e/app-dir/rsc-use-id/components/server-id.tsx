import { useId } from 'react'

// A Server Component that relies on `useId()` for a document-wide identifier.
export function ServerId({ label }: { label: string }) {
  const id = useId()
  return (
    <p id={id} data-server-id={label}>
      {label}: {id}
    </p>
  )
}
