'use client'
import { memo, useEffect } from 'react'

function log(name) {
  useEffect(() => {
    console.log(`[${name}] MOUNT`)
    return () => console.log(`[${name}] UNMOUNT`)
  }, [])
}

export const MemoArrow = memo(() => { log('memo-arrow'); return <div>a</div> })
export const MemoWithChildren = memo(function MWC({ children }) { log('memo-children'); return <div>{children}</div> })
export const MemoWithProps = memo(function MWP({ x }) { log('memo-props'); return <div>{x}</div> })
