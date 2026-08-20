import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      // Tailwind class used ONLY in mdx-components.tsx
      <h1 className="text-6xl font-bold text-fuchsia-500">{children}</h1>
    ),
    ...components,
  }
}
