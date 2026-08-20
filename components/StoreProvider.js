import { createContext, useContext } from 'react'
import { Store } from '../store'

let store
export const StoreContext = createContext()

export function useStore() {
  return useContext(StoreContext)
}

function initializeStore(initialData = null) {
  const _store = store ?? new Store()
  if (initialData) {
    _store.hydrate(initialData)
  }
  if (typeof window === 'undefined') return _store
  if (!store) store = _store
  return _store
}

export function StoreProvider({ children, hydrationData: initialData }) {
  const store = initializeStore(initialData)
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
