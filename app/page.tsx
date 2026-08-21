import Image from 'next/image'
import logo from '../public/logo.png'

export default function Page() {
  return (
    <main>
      <h1>basePath asset test</h1>
      <Image src={logo} alt="static import" priority />
      <Image src="/logo.png" alt="public string src" width={64} height={64} priority />
      <img src="/logo.png" alt="plain img tag" />
    </main>
  )
}
