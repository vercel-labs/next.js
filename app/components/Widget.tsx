'use client'
import { useEffect, useState } from 'react'

export function Widget({ forceRerender = false }: { forceRerender?: boolean }) {
  const [, setState] = useState<object>()
  useEffect(() => {
    if (forceRerender) setState({})
  }, [forceRerender])

  const menuList = [{ label: 'apple', value: 'apple' }]

  return (
    <my-select
      id="w"
      menuList={menuList}
      onmy-change={() => {
        ;(window as any).__events = ((window as any).__events || 0) + 1
        alert('my-change fired')
      }}
    />
  )
}
