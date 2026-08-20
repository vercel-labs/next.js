export default function Page() {
  return (
    <main>
      {[100, 200, 300, 400, 500].map((w) => (
        <p key={w} style={{ fontWeight: w, fontSize: 40, margin: 8 }}>
          {w} Poppins Handgloves 0123
        </p>
      ))}
      <hr />
      <p style={{ fontFamily: "system-ui", fontSize: 40 }}>system-ui reference</p>
    </main>
  );
}
