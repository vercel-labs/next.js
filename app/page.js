import Image from 'next/image'
import missedTarget from '../public/missed-target.jpg'

const SIZES = [
  '(max-width: 399px) 184px',
  '(max-width: 519px) 244px',
  '(max-width: 639px) 200px',
  '(max-width: 767px) 156px',
  '(max-width: 1023px) 220px',
  '(max-width: 1279px) 280px',
  '280px',
].join(',')

export default function Page() {
  return (
    <main>
      <h1>next/image srcSet ignores px values in `sizes` (#27547)</h1>
      <div
        id="wrapper"
        style={{ position: 'relative', width: 280, height: 158 }}
      >
        <Image
          id="target"
          src={missedTarget}
          fill
          sizes={SIZES}
          style={{ objectFit: 'cover' }}
          alt="missed target"
        />
      </div>
    </main>
  )
}
