'use client'

import Image from 'next/image'
import photo from '../../images/photo.png'

export default function Page() {
  // No placeholder="blur": blurDataURL is dead code but is still emitted.
  return <Image src={photo} alt="photo" />
}
