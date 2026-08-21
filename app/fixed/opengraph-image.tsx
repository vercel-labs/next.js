import { ImageResponse } from 'next/og'

// Same content, but with the explicit display:flex satori requires
export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex' }}>
        {`aaa`} 🎉
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
