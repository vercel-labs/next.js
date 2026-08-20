'use client'
import { big } from '../../lib/bigint-dep'

export default function Page() {
  return <p>bigint literal from dep: {big()}</p>
}
