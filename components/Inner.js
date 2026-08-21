import { forwardRef, useImperativeHandle } from 'react'

const Inner = forwardRef(function Inner(props, ref) {
  useImperativeHandle(ref, () => ({ hello: () => console.log('hello') }))
  return <div id="inner">inner component</div>
})

export default Inner
