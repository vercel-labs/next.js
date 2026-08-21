export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PAGE_LOAD_ID = window.__PAGE_LOAD_ID || String(Math.random());`,
          }}
        />
        {children}
      </body>
    </html>
  )
}
