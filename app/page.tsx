import ComponentPicker from './component-picker'

export default function Home() {
  return (
    <main>
      <p>Static content that should survive a failed chunk load.</p>
      <ComponentPicker />
    </main>
  )
}
