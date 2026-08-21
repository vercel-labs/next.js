import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const fontData = readFile(join(process.cwd(), 'assets/font.ttf'))

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        OG Image
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'CustomFont', data: await fontData, style: 'normal', weight: 400 }],
    }
  )
}
