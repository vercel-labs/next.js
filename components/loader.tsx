'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import animationData from './animation.json'

export default function Loader() {
  const [effectRan, setEffectRan] = useState(false)
  useEffect(() => {
    console.log('LOADER_EFFECT_RAN')
    setEffectRan(true)
  }, [])

  return (
    <div>
      <h1 id="loading">LOADING FALLBACK</h1>
      <p id="effect">{effectRan ? 'EFFECT_RAN' : 'EFFECT_DID_NOT_RUN'}</p>
      <div id="lottie-host" style={{ width: 200, height: 200 }}>
        <Lottie animationData={animationData} loop autoplay />
      </div>
    </div>
  )
}
