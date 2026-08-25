'use client'
import { helperA, helperC } from './boundary-helpers'
export default function NotFoundClient() {
  return <p>not found {helperA()} {helperC()}</p>
}
