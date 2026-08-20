'use client'
import { memo } from 'react'
import Base from './Base'
const Inner = memo(function Inner() { return <Base name="indirect-memo" /> })
export default function IndirectMemo() { return <Inner /> }
