import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'my-select': any
    }
  }
}
