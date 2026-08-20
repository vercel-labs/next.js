import React, { ReactNode } from 'react'

// Required "top level root layout" that only renders children,
// because the real root layout lives in app/[lang]/layout.tsx
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
