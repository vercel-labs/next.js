"use client"

// Purely client-side prop: a callback that is NOT a Server Action.
// This component is only ever rendered by another Client Component (chat.tsx),
// yet the Next.js TS plugin reports ts(71007) here.
export function Child({ resumeStream }: { resumeStream: () => void }) {
  return <button onClick={resumeStream}>resume</button>
}
