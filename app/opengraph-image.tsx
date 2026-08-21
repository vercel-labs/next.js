import { ImageResponse } from 'next/og'

export default async function Image() {
  return new ImageResponse(<div>{`aaa`} 🎉</div>, {
    width: 1200,
    height: 630,
  })
}
