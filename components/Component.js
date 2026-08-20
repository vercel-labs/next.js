import dynamic from 'next/dynamic'
const DynamicComponent = dynamic(() => import('./DynamicallyLoadedComponent'))
export default function Component() {
  return (
    <div>
      Dynamic component:
      <DynamicComponent />
    </div>
  )
}
