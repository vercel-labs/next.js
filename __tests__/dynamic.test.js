import { render, screen } from '@testing-library/react'
import Component from '../components/Component'

// Fails: dynamic component is not rendered on the initial synchronous render,
// and React logs "An update to ForwardRef(LoadableComponent) inside a test was
// not wrapped in act(...)" when the loader resolves outside of act().
it('renders the dynamically imported component synchronously', () => {
  render(<Component />)
  expect(screen.getByText(/I am dynamically loaded/)).toBeInTheDocument()
})

// Passes, but only because the assertion is awaited; the act(...) warning is
// still printed to the console.
it('renders the dynamically imported component after awaiting', async () => {
  render(<Component />)
  expect(await screen.findByText(/I am dynamically loaded/)).toBeInTheDocument()
})
