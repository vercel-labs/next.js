// Toggle `dir` between "ltr" and "rtl" to see the difference.
// dir="rtl" -> ViewTransition animation shows a white/blank frame instead of a cross-fade.
const DIR = process.env.NEXT_PUBLIC_DIR || 'rtl'

export default function RootLayout({ children }) {
  return (
    <html lang={DIR === 'rtl' ? 'ar' : 'en'} dir={DIR}>
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <style>{`
          @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
          @keyframes fade-out { from { opacity: 1 } to { opacity: 0 } }
          ::view-transition-old(root) { animation: fade-out 3s linear both; }
          ::view-transition-new(root) { animation: fade-in 3s linear both; }
        `}</style>
        {children}
      </body>
    </html>
  )
}
