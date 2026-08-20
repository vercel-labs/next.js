/**
 * @jest-environment jsdom
 */
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import dynamic from 'next/dynamic'

describe('next/dynamic', () => {
  it('test dynamic with jest', () => {
    const App = dynamic(() => import('./fixtures/stub-components/hello'))

    act(() => {
      const { unmount } = render(<App />)
      unmount()
    })
  })

  // https://github.com/vercel/next.js/issues/41725
  it('does not warn about updates not wrapped in act(...)', async () => {
    const Dynamic = dynamic(() => import('./fixtures/stub-components/hello'))

    function Page() {
      return (
        <div>
          Dynamic component:
          <Dynamic />
        </div>
      )
    }

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    try {
      render(<Page />)

      // Let the loader promise settle the way it would in a browser, i.e.
      // without wrapping it in `act(...)` from user land.
      await new Promise((resolve) => setTimeout(resolve, 0))

      const actWarnings = consoleError.mock.calls.filter((args) =>
        args.some(
          (arg) =>
            typeof arg === 'string' && arg.includes('not wrapped in act(...)')
        )
      )

      expect(actWarnings).toEqual([])
      expect(screen.getByText('hello')).toBeInTheDocument()
    } finally {
      consoleError.mockRestore()
    }
  })
})
