// Edit this comment to trigger HMR: v4

export default async function Page() {
  const res = await fetch("http://localhost:3001/api/test", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div style={{ fontFamily: "monospace", padding: 40 }}>
      <h1>OTel HMR Reproduction!</h1>
      <p>
        Downstream received <code>traceparent</code>:{" "}
        <strong style={{ color: data.hasTraceparent ? "green" : "red" }}>
          {data.hasTraceparent ? "YES" : "NO"}
        </strong>
      </p>
      {data.traceparent && (
        <p>
          <code>{data.traceparent}</code>
        </p>
      )}
      <hr />
      <p style={{ color: "#888", fontSize: 14 }}>
        Edit the comment at the top of <code>app/page.tsx</code> to trigger HMR,
        then refresh this page.
      </p>
    </div>
  );
}
