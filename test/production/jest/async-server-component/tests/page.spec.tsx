import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '../app/page'

it('renders an async Server Component', async () => {
  render(<Page />)

  expect(await screen.findByRole('heading')).toHaveTextContent('hello world')
})
