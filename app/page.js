import { logger } from '../logger'

export default function Page() {
  logger.info('hello from server component')
  return <p>check the terminal</p>
}
