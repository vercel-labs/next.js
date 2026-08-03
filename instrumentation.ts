export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const mb = (b: number) => Math.round(b / (1024 * 1024));
  const log = () => {
    if (process.env.FORCE_GC === '1' && (globalThis as any).gc) {
      ;(globalThis as any).gc()
    }
    const m = process.memoryUsage();
    console.log(
      `[mem] uptime=${Math.round(process.uptime())}s rss=${mb(m.rss)}MB heapUsed=${mb(m.heapUsed)}MB external=${mb(m.external)}MB arrayBuffers=${mb(m.arrayBuffers)}MB`
    );
  };
  log();
  setInterval(log, 5000).unref();
}
