'use client'
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { increment } from '../actions'

const qc = new QueryClient()

function List() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, fetchStatus } =
    useInfiniteQuery({
      queryKey: ['pages'],
      queryFn: async ({ pageParam }) => increment(pageParam),
      initialPageParam: 0,
      getNextPageParam: (last: number) => (last < 20 ? last : undefined),
    })
  const { ref, inView } = useInView()
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('[client] fetching next page')
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
  return (
    <div>
      <p id="rq-state">
        pages={data?.pages.length ?? 0} fetchStatus={fetchStatus} isFetching={String(isFetching)} isFetchingNext={String(isFetchingNextPage)}
      </p>
      {(data?.pages ?? []).map((n, i) => (
        <div key={i} style={{ height: 400, border: '1px solid #ccc' }}>page {n}</div>
      ))}
      <div ref={ref} id="sentinel">sentinel</div>
    </div>
  )
}

export default function RqClient() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  if (!m) return null
  return (
    <QueryClientProvider client={qc}>
      <List />
    </QueryClientProvider>
  )
}
