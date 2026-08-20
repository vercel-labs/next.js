// line 1
export default function Widget() {
  // The bug is on the next line: localStorage is only available on the client,
  // so the client render produces an extra <div> the server never rendered.
  const isLoggedIn = typeof window !== "undefined" && !!window.localStorage.getItem("token");
  return (
    <div className="widget">
      <p>static text</p>
      {isLoggedIn ? <div className="only-on-client">welcome back</div> : null}
    </div>
  );
}
