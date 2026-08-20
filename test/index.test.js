import { render } from '@testing-library/react'
import Home from '../pages/index'

it('renders page that imports an ESM-only dependency', () => {
  const { container } = render(<Home />)
  expect(container.textContent).toContain('id:')
})
