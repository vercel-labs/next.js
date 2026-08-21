// Plain Node ESM resolution of `next` subpaths (no bundler involved).
for (const spec of ['next/link', 'next/link.js', 'next/navigation', 'next/navigation.js', 'next/document']) {
  try { await import(spec); console.log(`${spec}: OK`); }
  catch (e) { console.log(`${spec}: FAIL ${e.code}`); }
}
