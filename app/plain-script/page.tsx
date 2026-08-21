import { Widget } from '../components/Widget'

export default function Page() {
  return (
    <>
      <script src="/my-element.js" async={false} />
      <h1>plain script tag</h1>
      <Widget />
    </>
  )
}
