import { cookies } from 'next/headers'

// Only ever called on the server, via a conditional dynamic import.
export function getFromServer() {
  return cookies().toString()
}
