import { bigRows, jsonLd } from '../big-data';

export default function Page() {
  const rows = bigRows();
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ul>{rows.map((r) => <li key={r.id}>{r.name}: {r.blurb}</li>)}</ul>
    </div>
  );
}
