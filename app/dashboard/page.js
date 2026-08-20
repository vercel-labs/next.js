// description present but undefined -> expected to inherit parent description
export const metadata = { title: 'Dashboard', description: undefined }
export default function Page() {
  return <h1>Dashboard</h1>
}
