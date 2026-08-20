'use client'
import { observer } from 'mobx-react'
import { counterStore } from './store'

const Counter = observer(function Counter() {
  return (
    <div>
      <p id="count">count: {counterStore.count}</p>
      <button id="inc" onClick={() => counterStore.inc()}>inc</button>
    </div>
  )
})
export default Counter
