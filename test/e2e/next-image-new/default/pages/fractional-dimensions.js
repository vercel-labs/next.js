import React from 'react'
import Image from 'next/image'

// The aspect ratio of /wide.png is 1200x700, so scaling the width down to
// 301px results in a fractional height. This mimics computing the height from
// dimensions provided by a CMS.
const width = 301
const height = (700 / 1200) * width

const Page = () => {
  return (
    <div>
      <p>Fractional Dimensions</p>
      <Image
        id="fractional"
        src="/wide.png"
        width={width}
        height={height}
        loading="eager"
      />
    </div>
  )
}

export default Page
