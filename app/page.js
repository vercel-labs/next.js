import { SomeComponent, someFun, someHook } from '@some/library'

export default function Page() {
  return (
    <main>
      <SomeComponent>hello</SomeComponent>
      <p id="fun">{someFun()}</p>
      <p id="hook">{someHook()}</p>
    </main>
  )
}
