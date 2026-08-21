// Pass-through root layout: html/body live in each nested root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
