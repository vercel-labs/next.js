export const metadata = { title: 'next#91448 repro' }

// Renders any uncaught client error into the DOM so that the failure is
// visible in a screenshot of a browser without devtools automation.
const errorReporter = `
window.__NEXT_91448_ERRORS = [];
function beacon91448(msg) {
  try { new Image().src = '/api/client-error?m=' + encodeURIComponent(msg) } catch (e) {}
}
function render91448() {
  var el = document.getElementById('client-errors');
  if (el) el.textContent = window.__NEXT_91448_ERRORS.join('\\n\\n') || '(none)';
}
window.addEventListener('error', function (e) {
  var m = 'window.onerror: ' + ((e.error && (e.error.stack || e.error.message)) || e.message);
  window.__NEXT_91448_ERRORS.push(m);
  beacon91448(m);
  render91448();
});
window.addEventListener('unhandledrejection', function (e) {
  var m = 'unhandledrejection: ' + ((e.reason && (e.reason.stack || e.reason.message)) || e.reason);
  window.__NEXT_91448_ERRORS.push(m);
  beacon91448(m);
  render91448();
});
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    render91448();
    beacon91448('hydration-state: ' + (document.getElementById('hydration-state') || {}).textContent);
  }, 2000);
});
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: errorReporter }} />
      </head>
      <body style={{ fontFamily: 'monospace', fontSize: 20 }}>{children}</body>
    </html>
  )
}
