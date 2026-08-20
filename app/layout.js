import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const mono = JetBrains_Mono({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={mono.className}>{children}</body>
    </html>
  );
}
