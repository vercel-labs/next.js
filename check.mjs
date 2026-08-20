const base = process.env.BASE || 'http://localhost:3000';
const read = async (p) => {
  const html = await (await fetch(base + p, { cache: 'no-store' })).text();
  const m = html.match(/id="value">(\d+)/);
  return m ? m[1] : 'none';
};
for (const path of ['/rated-dynamic', '/usecache']) {
  const before = await read(path);
  await fetch(base + '/api/rate/42', { method: 'POST', cache: 'no-store' });
  await new Promise((r) => setTimeout(r, 2000));
  const after = [await read(path), await read(path), await read(path)];
  console.log(
    `${path}: before=${before} after=[${after.join(',')}] revalidated=${after.some((v) => v !== before)}`
  );
}
