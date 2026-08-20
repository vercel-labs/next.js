import { renderToString } from 'react-dom/server'
import Test from './app/Test'

export default async function parse() {
  return renderToString(<Test />)
}
