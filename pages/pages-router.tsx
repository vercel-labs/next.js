import { useEffect } from 'react'
export default function PagesRouterPage() {
  useEffect(() => {
    const onOver = () => console.log('BODY mouseover fired (pages router)')
    document.body.addEventListener('mouseover', onOver)
    return () => document.body.removeEventListener('mouseover', onOver)
  }, [])
  return (
    <div
      id="box"
      onMouseOver={(e) => {
        e.stopPropagation()
        console.log('BOX onMouseOver + stopPropagation (pages router)')
      }}
      style={{ width: 200, height: 200, background: 'red' }}
    />
  )
}
