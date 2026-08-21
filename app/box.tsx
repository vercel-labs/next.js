'use client'

import { ViewTransition } from 'react'
import { vtLog } from './log'

export function Box({ size }: { size: number }) {
  return (
    <ViewTransition
      name="shared-box"
      onShare={() => vtLog('onShare')}
      onUpdate={() => vtLog('onUpdate')}
      onEnter={() => vtLog('onEnter')}
      onExit={() => vtLog('onExit')}
    >
      <div
        id="box"
        style={{ width: size, height: size, background: 'rebeccapurple' }}
      />
    </ViewTransition>
  )
}
