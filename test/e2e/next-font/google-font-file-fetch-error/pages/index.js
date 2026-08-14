import { Indie_Flower } from 'next/font/google'

const indieFlower = Indie_Flower({ weight: '400', subsets: ['latin'] })

export default function Page() {
  return <p className={indieFlower.className}>hello world</p>
}
