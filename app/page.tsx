import './from-scss.scss'
import './from-css.css'

export default function Page() {
  return (
    <main>
      <p>SCSS (broken: #passport fragment stripped)</p>
      <div id="scss" className="sprite-scss" />
      <p>CSS (works)</p>
      <div id="css" className="sprite-css" />
    </main>
  )
}
