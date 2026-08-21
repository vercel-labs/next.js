// Root layout intentionally has NO <html>/<body>: they live in app/[locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
