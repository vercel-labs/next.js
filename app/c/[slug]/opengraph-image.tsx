import { ImageResponse } from 'next/og'

export const size = { width: 600, height: 300 }
export const contentType = 'image/png'

// generateStaticParams exported from the image file itself
export function generateStaticParams() {
  return [{ slug: 'one' }, { slug: 'two' }]
}
export default async function Image({ params }: any) {
  const p = await params
  return new ImageResponse(
    (
      <div style={{ display: 'flex', fontSize: 48, background: '#fff', width: '100%', height: '100%' }}>
        {`c ${p?.slug}`}
      </div>
    ),
    size
  )
}
