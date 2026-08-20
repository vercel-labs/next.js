// Oops: this was meant to be a plain React icon component,
// but `app/icon.js` is a Next.js metadata file convention.
export default function Icon({ label }) {
  return <span aria-label={label}>★</span>
}
