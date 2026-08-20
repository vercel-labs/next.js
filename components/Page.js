import { observer } from 'mobx-react-lite'
import { useStore } from './StoreProvider'
import Router from 'next/router'

let pageCount = 0
const Page = observer(function Page() {
  const store = useStore()
  if (typeof window !== 'undefined') console.log('PAGE RENDER', ++pageCount)
  const photos = store.photos
  return (
    <div>
      <button id="go1" onClick={() => Router.push('/ssg/1')}>first</button>
      <button id="go2" onClick={() => Router.push('/ssg/2')}>two</button>
      <div id="len">{Array.isArray(photos) ? photos.length : 0}</div>
    </div>
  )
})
export default Page
