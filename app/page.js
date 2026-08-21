import "./globals.css";

export default function Page() {
  return (
    <main>
      <div className="bad" id="bad">bad order (backdrop-filter first)</div>
      <div className="good" id="good">good order (-webkit first)</div>
    </main>
  );
}
