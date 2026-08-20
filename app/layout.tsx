import Navigation from "./navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 40 }}>
        <Navigation />
        <main id="content">{children}</main>
      </body>
    </html>
  );
}
