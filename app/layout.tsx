export const metadata = { title: "repro" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root-layout-marker">ROOT LAYOUT</div>
        {children}
      </body>
    </html>
  );
}
