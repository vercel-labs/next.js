export function bigRows() {
  const rows = [];
  for (let i = 0; i < 4000; i++) {
    rows.push({ id: i, name: 'pokemon-' + i, blurb: 'x'.repeat(200) });
  }
  return rows;
}
export const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'repro-97299',
  filler: 'y'.repeat(2000),
});
