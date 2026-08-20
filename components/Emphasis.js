import { emphasis } from '../styles/emphasis.css'
export default function Emphasis({ extra = '', children }) {
  return <div id="shared" className={`${extra} ${emphasis}`}>{children}</div>
}
