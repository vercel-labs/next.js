export const metadata = {
  title: "next/image basePath reproduction",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
