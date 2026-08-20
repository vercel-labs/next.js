import { useEffect } from 'react'
export default function Home() {
  useEffect(() => {
    setTimeout(() => { throw new Error('old error 1') }, 100)
    setTimeout(() => { throw new Error('old error 2') }, 200)
    setTimeout(() => { throw new Error('old error 3') }, 300)
  }, [])
  return <h1>old</h1>
}
