import Image from 'next/image'
import ball from '../../public/ball.png'
export default function P() {
  return <Image src={ball} alt="a" placeholder="blur" priority />
}
