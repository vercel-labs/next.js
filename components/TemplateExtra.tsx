'use client'
import { helperA, helperB } from './boundary-helpers'
export default function TemplateExtra() {
  return <span>{helperA()}{helperB()}</span>
}
