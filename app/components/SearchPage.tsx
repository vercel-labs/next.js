'use client'

// Missing import of the real SearchPage: the component recurses into itself.
export function SearchPage() {
  return <SearchPage />
}
