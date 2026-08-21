import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-dynamic';

async function ls(p: string) {
  try {
    return await readdir(p);
  } catch (error) {
    return String((error as Error).message);
  }
}

export async function GET() {
  const cwd = process.cwd();
  return Response.json({
    cwd,
    next: require('next/package.json').version,
    lsCwd: await ls(cwd),
    lsAssetsFonts: await ls(join(cwd, 'assets/fonts')),
    lsPublicOg: await ls(join(cwd, 'public/images/og')),
  });
}
