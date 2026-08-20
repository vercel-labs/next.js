import Refresh from './refresh'
export default function Page() {
  return (
    <div data-target className="bg-blue-600 p-10 text-white">
      Giris {Date.now()}
      <Refresh />
    </div>
  )
}
