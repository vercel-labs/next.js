import rawRequest from '../lib/rawRequest';

export default async function RootLayout({ children, modal }) {
  const data = await rawRequest('/layout-request');
  console.log('[RootLayout render] request #', data.hit);
  return (
    <html>
      <body>
        <div id="layout-hit">layout request #{data.hit}</div>
        {children}
        {modal}
      </body>
    </html>
  );
}
