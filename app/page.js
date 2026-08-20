import Image from 'next/image'

// Simulates CMS data (e.g. Hygraph) returning real intrinsic dimensions as strings
const imageData = { src: '/img.png', width: '1200', height: '800' }

export default function Page() {
  const { src, width, height } = imageData
  // hardcode desired width, compute matching height -> fractional value
  const displayWidth = 300
  const aspectRatioHeight = (+height / +width) * displayWidth // 200 -> integer, ok
  const fractionalHeight = (+height / +width) * 301 // 200.666... -> triggers warning

  return (
    <main>
      <h1>Both width and height are set as numbers</h1>
      <p id="integer-case">integer height ({aspectRatioHeight})</p>
      <Image src={src} alt="" width={displayWidth} height={aspectRatioHeight} />
      <p id="fractional-case">fractional height ({fractionalHeight})</p>
      <Image src={src} alt="" width={301} height={fractionalHeight} />
    </main>
  )
}
