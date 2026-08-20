'use client'
import styled from '@emotion/styled'

// Control: inline options object -> component selectors work
const A = styled('div', { shouldForwardProp: (p) => !p.startsWith('$') })`
  color: red;
`

const B = styled('div', { shouldForwardProp: (p) => !p.startsWith('$') })`
  color: blue;
  ${A} {
    color: green;
  }
`

export default function Inline() {
  return (
    <B id="b">
      <A id="a">A inside B</A>
    </B>
  )
}
