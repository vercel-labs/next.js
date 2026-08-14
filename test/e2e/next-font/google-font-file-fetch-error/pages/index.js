import { Roboto } from 'next/font/google'

const roboto = Roboto({ weight: '400', subsets: ['latin'] })

export default function Page() {
  return (
    <p id="roboto" className={roboto.className}>
      {JSON.stringify(roboto)}
    </p>
  )
}
