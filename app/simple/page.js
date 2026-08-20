'use client'
import styled from '@emotion/styled'
const A = styled.div`color: red;`
const B = styled.div`
  color: blue;
  ${A} { color: green; }
`
export default function Simple() { return <B><A>A inside B</A></B> }
