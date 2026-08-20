import Image from 'next/image'
import car from '../car_image.png'

export default function Home() {
  return (
    <div>
      <h1 id="title">repro 68278</h1>
      <pre id="import-value">{JSON.stringify(car)}</pre>
      <Image id="next-image" src={car} alt="car" />
      <img id="plain-img" src={typeof car === 'string' ? car : car.src} alt="car plain" />
    </div>
  )
}
