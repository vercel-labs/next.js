import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return <p>path: {router.pathname}</p>
}
