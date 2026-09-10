import Client from "./Client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Client>{children}</Client>
      </body>
    </html>
  );
}
