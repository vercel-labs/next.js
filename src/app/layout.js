import './globals.css';
import './green.css';
import './z.css';
import './yellow.css';

export const metadata = { title: 'css order' };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
