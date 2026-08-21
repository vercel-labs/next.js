// Emits many hoisted <style precedence href> tags, standing in for a large real
// app's CSS output. React hoists these into <head> *before* Next.js metadata tags.
export function BigStyles({ count = 400 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <style key={i} precedence={`p${i}`} href={`s${i}`}>
          {`.filler-${i}{color:#${(i % 16).toString(16).repeat(6)};background:#fff;padding:${i}px;margin:${i}px;border:1px solid #eee;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}`}
        </style>
      ))}
    </>
  );
}
