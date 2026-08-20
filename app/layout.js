import MemoClient from './memo-client'
import PlainClient from './plain-client'
import { MemoArrow, MemoWithChildren, MemoWithProps } from './variants'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MemoClient />
        <PlainClient />
        <MemoArrow />
        <MemoWithChildren><span>kid</span></MemoWithChildren>
        <MemoWithProps x="1" />
        {children}
      </body>
    </html>
  )
}
