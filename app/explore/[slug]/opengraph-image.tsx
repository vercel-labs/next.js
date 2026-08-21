import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Foo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Reproduction of https://github.com/vercel/next.js/issues/77498
// Dynamic route -> the OG image is generated at request time, not at build time.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cwd = process.cwd();

  try {
    const font = await readFile(join(cwd, 'assets/fonts/Inter-Bold.ttf'));
    const logo = await readFile(join(cwd, 'public/images/og/logo.png'));

    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', fontSize: 56 }}>
          {slug} · font {font.byteLength}B · logo {logo.byteLength}B
        </div>
      ),
      { ...size, fonts: [{ name: 'Inter', data: font, style: 'normal', weight: 500 }] }
    );
  } catch (error) {
    // Surface the runtime failure in the HTTP response instead of only in the platform log.
    return new Response(`cwd=${cwd}\n${(error as Error).stack}`, {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    });
  }
}
