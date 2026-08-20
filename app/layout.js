import { MockProvider } from './mock-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MockProvider>{children}</MockProvider>
      </body>
    </html>
  );
}
