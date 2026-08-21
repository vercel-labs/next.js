import { Foo } from 'foo';
// import { Foo } from '../src/components';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Foo />
        {children}
      </body>
    </html>
  );
}
