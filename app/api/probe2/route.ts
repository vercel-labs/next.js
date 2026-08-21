import { readFileSync, readdirSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function safe<T>(fn: () => T) {
  try { return fn(); } catch (e) { return String(e); }
}

export function GET() {
  const cwd = process.cwd();
  return Response.json({
    cwd,
    cwdEntries: safe(() => readdirSync(cwd).slice(0, 40)),
    rsf: safe(() => {
      const c = JSON.parse(readFileSync(path.join(cwd, '.next/required-server-files.json'), 'utf8')).config;
      return { deploymentId: c.deploymentId, rsdi: c.experimental?.runtimeServerDeploymentId, supportsImmutableAssets: c.supportsImmutableAssets };
    }),
    manifestTail: safe(() => readFileSync(path.join(cwd, '.next/server/app/dyn/page_client-reference-manifest.js'), 'utf8').slice(-320)),
    env: {
      NEXT_DEPLOYMENT_ID: process.env['NEXT_DEPLOYMENT' + '_ID'] ?? null,
      NOW_BUILDER: process.env.NOW_BUILDER ?? null,
      VERCEL: process.env.VERCEL ?? null,
      NEXT_SUPPORTS_IMMUTABLE_ASSETS: process.env['NEXT_SUPPORTS_IMMUTABLE' + '_ASSETS'] ?? null,
    },
  });
}
