import pino from 'pino';
import { headers } from 'next/headers';

const logger = pino({ level: 'info' });

export default async function Home() {
  await headers(); // force dynamic rendering
  logger.info('page rendered');
  return <div>pino loaded</div>;
}
