import { lazy, Suspense, useState } from 'react'

const routes = {
  0: lazy(() => import('./routes/route-0')),
  1: lazy(() => import('./routes/route-1')),
  2: lazy(() => import('./routes/route-2')),
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(0)
  const Route = routes[currentRoute]

  return (
    <main>
      {Object.keys(routes).map((route) => (
        <button
          id={`route-${route}-button`}
          key={route}
          onClick={() => setCurrentRoute(Number(route))}
        >
          R{route}
        </button>
      ))}
      <Suspense fallback={<p>Loading</p>}>
        <Route />
      </Suspense>
    </main>
  )
}
