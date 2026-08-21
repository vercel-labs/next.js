import './style.css'
import svgUrl from './img.svg'

export default function Page() {
  return (
    <div>
      <div className="bg" id="bg" />
      <p id="imported">{String(svgUrl)}</p>
    </div>
  )
}
