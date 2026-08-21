import { NavigationWrapper } from '../components/NavigationWrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationWrapper>{children}</NavigationWrapper>
      </body>
    </html>
  )
}
