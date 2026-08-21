export const metadata = {
  title: "Suspense hidden-document repro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
