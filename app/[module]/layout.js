export default async function ModuleLayout({ children, params, searchParams }) {
  const p = await params;
  console.log('[layout] params =', p, 'searchParams =', searchParams);
  return (
    <div>
      <h2 id="layout-params">params in layout: {JSON.stringify(p ?? null)}</h2>
      <h2 id="layout-search">searchParams in layout: {JSON.stringify(searchParams ?? null)}</h2>
      {children}
    </div>
  );
}
