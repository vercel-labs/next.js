// Repro for https://github.com/vercel/next.js/issues/74549
// Docs gap: Pages Router has no "Upgrading: Version 15" guide, App Router does.
const checks = [
  ['App Router v15 guide page', 'https://nextjs.org/docs/app/guides/upgrading/version-15'],
  ['Pages Router v15 guide page', 'https://nextjs.org/docs/pages/guides/upgrading/version-15'],
  ['App Router upgrading index', 'https://nextjs.org/docs/app/guides/upgrading'],
  ['Pages Router upgrading index', 'https://nextjs.org/docs/pages/guides/upgrading'],
];
const sources = [
  ['canary docs/01-app/02-guides/upgrading', 'https://api.github.com/repos/vercel/next.js/contents/docs/01-app/02-guides/upgrading?ref=canary'],
  ['canary docs/02-pages/02-guides/upgrading', 'https://api.github.com/repos/vercel/next.js/contents/docs/02-pages/02-guides/upgrading?ref=canary'],
];

let fail = false;
for (const [label, url] of checks) {
  const res = await fetch(url, { redirect: 'follow' });
  const body = await res.text();
  const missing = res.status === 404 || /Page Not Found/i.test(body);
  const mentionsV15 = /pages\/guides\/upgrading\/version-15/.test(body) || /app\/guides\/upgrading\/version-15/.test(body) && label.startsWith("App");
  console.log(`${label}: HTTP ${res.status} exists=${!missing} links-own-router-v15-guide=${mentionsV15}`);
  console.log(`  ${url}`);
  if (label.startsWith('Pages') && (missing || !mentionsV15)) fail = true;
}

for (const [label, api] of sources) {
  const res = await fetch(api, { headers: { 'user-agent': 'issue-74549-repro' } });
  const files = (await res.json()).map((f) => f.name).sort();
  console.log(`${label}: ${files.join(', ')}`);
  if (label.includes('02-pages') && !files.includes('version-15.mdx')) fail = true;
}

console.log(fail ? '\nRESULT: REPRODUCED - Pages Router v15 upgrade guide is missing' : '\nRESULT: not reproduced - Pages Router v15 guide exists');
process.exit(fail ? 1 : 0);
