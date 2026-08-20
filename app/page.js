'use client'
import styled from '@emotion/styled'

// Options passed as a variable reference -> component selectors fail
const options = { shouldForwardProp: (p) => !p.startsWith('$') }

const A = styled('div', options)`
  color: red;
`

const B = styled('div', options)`
  color: blue;
  ${A} {
    color: green;
  }
`

export default function Home() {
  return (
    <B id="b">
      <A id="a">A inside B</A>
    </B>
  )
}
