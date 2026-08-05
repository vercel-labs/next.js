/** Reproduction for https://github.com/vercel/next.js/issues/96634 */
export default function Home() {
  return (
    <div style={{ height: "200vh", padding: 16 }}>
      <p>
        On a touch device (or Chrome DevTools touch emulation), drag upward or
        diagonally starting on the Next.js DevTools indicator. The browser
        starts a viewport scroll and fires <code>pointercancel</code>; the
        indicator is left stuck mid-drag.
      </p>
    </div>
  );
}
