import { headers } from 'next/headers'

export default async function Login() {
  const host = (await headers()).get('host')
  return <p>login page served for host: {host}</p>
}
