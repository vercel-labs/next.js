'use client'
import { helperA, helperB, helperC } from './boundary-helpers'
export default function LoadingSpinner() {
  return <div>loading {helperA()} {helperB()} {helperC()}</div>
}
