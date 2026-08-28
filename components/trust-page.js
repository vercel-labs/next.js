import { ClientBadge } from './client-badge'
export function PublicTrustPage({ title, children }) {
  return (
    <main>
      <h1>{title}</h1>
      <ClientBadge label={title} />
      {children}
    </main>
  )
}
