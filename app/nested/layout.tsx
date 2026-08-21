export const dynamic = 'force-static'

export default function NestedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p id="layout-time">nested layout (force-static) rendered at: {Date.now()}</p>
      {children}
    </div>
  )
}
