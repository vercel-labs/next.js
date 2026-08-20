'use client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  return (
    <>
      <h1 id="login">LOGIN</h1>
      <button
        id="signin"
        onClick={async () => {
          await fetch('/api/login')
          router.push('/')
        }}
      >
        Click to Login
      </button>
    </>
  )
}
