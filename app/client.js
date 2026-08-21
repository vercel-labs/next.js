'use client'

export default function Client() {
  return <p id="client">client: {process.env.NEXT_PUBLIC_API_URL}</p>
}
