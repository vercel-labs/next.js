import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Reconcile } from '../app/reconcile'

export default function PagesTest() {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  )
  return (
    <QueryClientProvider client={client}>
      <Reconcile />
    </QueryClientProvider>
  )
}
