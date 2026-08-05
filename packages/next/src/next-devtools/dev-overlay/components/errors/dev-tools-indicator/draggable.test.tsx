/**
 * @jest-environment jsdom
 */
/* eslint-disable @next/internal/typechecked-require -- Not a prod file */
/* eslint-disable import/no-extraneous-dependencies -- Not a prod file */

import type { Corners } from '../../../shared'

import { act } from 'react'
import { createRoot } from 'react-dom/client'

import { Draggable } from './draggable'

// jsdom does not implement PointerEvent nor pointer capture.
class MockPointerEvent extends MouseEvent {
  pointerId: number
  constructor(
    type: string,
    init: MouseEventInit & { pointerId?: number } = {}
  ) {
    super(type, init)
    this.pointerId = init.pointerId ?? 1
  }
}

function installPointerEventPolyfill() {
  const globalAny = window as any
  const previous = globalAny.PointerEvent
  globalAny.PointerEvent = MockPointerEvent
  Element.prototype.setPointerCapture = function () {}
  Element.prototype.releasePointerCapture = function () {}
  return () => {
    globalAny.PointerEvent = previous
  }
}

function dispatchPointerEvent(
  target: EventTarget,
  type: string,
  init: MouseEventInit & { pointerId?: number } = {}
) {
  act(() => {
    target.dispatchEvent(
      new MockPointerEvent(type, {
        bubbles: true,
        cancelable: true,
        button: 0,
        pointerId: 1,
        ...init,
      })
    )
  })
}

describe('Draggable', () => {
  let restorePointerEvent: () => void
  let container: HTMLDivElement
  let root: ReturnType<typeof createRoot>

  beforeEach(() => {
    ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
    restorePointerEvent = installPointerEventPolyfill()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    document.body.removeAttribute('style')
    restorePointerEvent()
    ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false
  })

  function render(setPosition: (position: Corners) => void = () => {}) {
    act(() => {
      root.render(
        <Draggable
          padding={20}
          position="bottom-left"
          setPosition={setPosition}
        >
          <button id="handle">indicator</button>
        </Draggable>
      )
    })
    const handle = container.querySelector('#handle') as HTMLElement
    return { handle, draggable: handle.parentElement as HTMLElement }
  }

  it('resets the drag state when the pointer is cancelled', () => {
    // A touch drag that turns into a browser initiated scroll ends with
    // `pointercancel` and no `pointerup`. See
    // https://github.com/vercel/next.js/issues/96634
    const setPosition = jest.fn()
    const { handle, draggable } = render(setPosition)

    dispatchPointerEvent(handle, 'pointerdown', { clientX: 20, clientY: 600 })
    dispatchPointerEvent(window, 'pointermove', { clientX: 22, clientY: 585 })

    expect(draggable.classList.contains('dev-tools-grabbing')).toBe(true)
    expect(draggable.style.translate).toBe('2px -15px')
    expect(document.body.style.userSelect).toBe('none')

    dispatchPointerEvent(window, 'pointercancel', { clientX: 22, clientY: 585 })

    // The drag must not stay active once the pointer was cancelled.
    expect(draggable.classList.contains('dev-tools-grabbing')).toBe(false)
    expect(document.body.style.userSelect).toBe('')
    expect(draggable.style.translate).not.toBe('2px -15px')

    // Further pointer movement must not keep dragging the indicator.
    dispatchPointerEvent(window, 'pointermove', { clientX: 100, clientY: 100 })
    expect(draggable.classList.contains('dev-tools-grabbing')).toBe(false)
  })

  it('resets the drag state on pointerup', () => {
    const { handle, draggable } = render()

    dispatchPointerEvent(handle, 'pointerdown', { clientX: 20, clientY: 600 })
    dispatchPointerEvent(window, 'pointermove', { clientX: 22, clientY: 585 })

    expect(draggable.classList.contains('dev-tools-grabbing')).toBe(true)

    dispatchPointerEvent(window, 'pointerup', { clientX: 22, clientY: 585 })

    expect(draggable.classList.contains('dev-tools-grabbing')).toBe(false)
    expect(document.body.style.userSelect).toBe('')
  })
})
