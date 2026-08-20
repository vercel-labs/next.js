import Navbar from '../components/Navbar'
import MemoNavbar from '../components/MemoNavbar'

export const metadata = { title: 'repro 52558' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <MemoNavbar />
        {children}
      </body>
    </html>
  )
}
