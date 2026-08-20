import s from '../styles/emphasis.module.css'
export default function EmphasisCss({ extra = '', children }) {
  return <div id="shared" className={`${extra} ${s.emphasis}`}>{children}</div>
}
