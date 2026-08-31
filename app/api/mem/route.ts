import v8 from 'v8';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.has('gc')) {
    for (let i = 0; i < 4; i++) {
      (global as any).gc?.();
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  let snapshot: string | undefined;
  if (url.searchParams.has('snapshot')) {
    snapshot = v8.writeHeapSnapshot(`/workspace/.next-maintainer/reproduction-artifacts/heap-${url.searchParams.get('snapshot')}.heapsnapshot`);
  }
  const m = process.memoryUsage();
  return Response.json({
    label: url.searchParams.get('label') ?? null,
    rssMB: +(m.rss / 1048576).toFixed(1),
    heapUsedMB: +(m.heapUsed / 1048576).toFixed(1),
    heapTotalMB: +(m.heapTotal / 1048576).toFixed(1),
    externalMB: +(m.external / 1048576).toFixed(1),
    snapshot,
    fileExists: snapshot ? fs.existsSync(snapshot) : undefined,
  });
}
