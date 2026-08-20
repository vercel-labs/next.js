import "./global.css";

export const metadata = {
  title: "NextGram",
  description:
    "A sample Next.js app showing dynamic routing with modals as a route.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className="layout">
          <h1>Root layout</h1>
          {props.children}
        </div>
      </body>
    </html>
  );
}
