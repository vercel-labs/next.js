// Type-level half of the issue: Next.js augments the global RequestInit with
// `next`, so TypeScript accepts this even though the native Request constructor
// silently drops the property at runtime. `npx tsc --noEmit` reports no error.
export const req = new Request('http://localhost:4000/todo', {
  next: { tags: ['test-todo'], revalidate: 60 },
})
// Proof the property is gone at runtime: undefined
export const dropped = (req as any).next
