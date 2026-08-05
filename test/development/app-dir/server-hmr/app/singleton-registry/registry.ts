import type { ReactNode } from 'react'

export type RegisteredComponent = (...args: any[]) => ReactNode

const registry = new Map<string, RegisteredComponent>()
let didRegister = false

// Run-once guard: with server HMR this module keeps its state across edits to
// other modules, so `register` is only ever effective on the first evaluation.
export function register(components: Map<string, RegisteredComponent>) {
  if (didRegister) {
    return
  }

  components.forEach((component, key) => {
    registry.set(key, component)
  })

  didRegister = true
}

export function getComponent(key: string): RegisteredComponent {
  const component = registry.get(key)

  if (!component) {
    throw new Error(`Component "${key}" was not found in registry.`)
  }

  return component
}
