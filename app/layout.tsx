import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="p-4 text-sm">{children}</body></html>)
}
