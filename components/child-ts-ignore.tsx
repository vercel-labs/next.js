"use client"

// Attempting to silence the plugin warning: neither @ts-ignore nor eslint-disable works,
// because 71007 comes from the Next.js tsserver plugin, not the TS compiler.
export function ChildIgnored({
  // @ts-ignore
  // eslint-disable-next-line
  resumeStream,
}: {
  // @ts-ignore
  resumeStream: () => void
}) {
  return <button onClick={resumeStream}>resume</button>
}
