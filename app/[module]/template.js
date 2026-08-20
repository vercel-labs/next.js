export default function ModuleTemplate({ children, params, searchParams }) {
  console.log('[template] params =', params, 'searchParams =', searchParams);
  return (
    <div>
      <h2 id="tpl-params">params in template: {JSON.stringify(params ?? null)}</h2>
      <h2 id="tpl-search">searchParams in template: {JSON.stringify(searchParams ?? null)}</h2>
      <div>{children}</div>
    </div>
  );
}
