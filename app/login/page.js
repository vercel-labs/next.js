import Link from 'next/link'
export const dynamic = 'force-dynamic'
export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <footer>
        <Link href="/privacidade">Privacidade</Link>
        <Link href="/seguranca">Seguranca</Link>
        <Link href="/termos">Termos</Link>
        <Link href="/suporte">Suporte</Link>
        <Link href="/reset-password">Reset</Link>
      </footer>
    </div>
  )
}
