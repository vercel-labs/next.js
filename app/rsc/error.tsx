'use client'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return <pre id="result">{'error.message: ' + error.message + ' | digest: ' + error.digest}</pre>
}
