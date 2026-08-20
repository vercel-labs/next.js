import React from 'react'

const ESIInclude = (props : any) => {
  const { children, ...attributes } = props
  return React.createElement("esi:include", attributes, children)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head></head>
      <body>{children}<ESIInclude src="foo.bar" /></body>
    </html>
  )
}
