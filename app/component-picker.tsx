'use client'

import dynamic from 'next/dynamic'

const Foo = dynamic(() => import('./foo'), { ssr: false })

export default function ComponentPicker() {
  return (
    <>
      <h1>Foo:</h1>
      <Foo />
    </>
  )
}
