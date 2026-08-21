import fillers from "../../fillers.json";

export default function Home() {
  return (
    <main>
      <h1>hello next</h1>
      {fillers.map((f, i) => (
        <p key={i} style={{ height: 40 }}>{f}</p>
      ))}
      <p id="needle">unicornmagic</p>
      {fillers.map((f, i) => (
        <p key={"b" + i} style={{ height: 40 }}>{f}</p>
      ))}
    </main>
  );
}
