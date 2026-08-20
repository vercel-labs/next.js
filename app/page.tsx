import MyComponent from './components'
import InlineDefault from './inline-default'

export default function Page() {
  return (
    <>
      <MyComponent myFunc={() => {}} />
      <InlineDefault myFunc={() => {}} />
    </>
  )
}
