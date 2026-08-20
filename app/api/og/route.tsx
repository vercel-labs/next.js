import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <img
        src="https://dummyimage.com/600x400/000/fff"
        alt=""
        style={{ width: 600, height: 400, objectFit: 'contain' }}
      />
    ),
    { width: 600, height: 400 }
  )
}
