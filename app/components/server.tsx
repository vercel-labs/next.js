import { InternalClientComponent } from './client'

export function ServerComponent({ data }: { data: unknown }) {
  return (
    <InternalClientComponent>
      <button>a plain button</button>
    </InternalClientComponent>
  )
}
