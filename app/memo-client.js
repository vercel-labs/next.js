'use client'
import { memo, useEffect } from 'react'

const MemoClient = memo(function MemoClient() {
  useEffect(() => {
    console.log('[memo] MOUNT')
    return () => console.log('[memo] UNMOUNT')
  }, [])
  return <div id="memo">memo client component</div>
})

export default MemoClient
