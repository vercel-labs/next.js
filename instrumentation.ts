export async function register() {
  // prevent this from running in the edge runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { default: pino } = await import('pino');
    const logger = pino(pino.transport({ target: 'pino/file', options: { destination: 1 } }));
    logger.info('instrumentation registered');
  }
}
