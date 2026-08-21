import Nav from './components/nav';
import CookieSetter from './components/cookie-setter';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Nav />
        <CookieSetter name="layout" />
        {children}
      </body>
    </html>
  );
}
