import { Container, ConfigSymbol } from '@demo/di-core';
import { ServiceDeps } from '@demo/service';

export default function Home({ ok, answer, error }) {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, whiteSpace: 'pre-wrap' }}>
      <h1>rspack NextExternalsPlugin repro</h1>
      <p>SSR resolve result: {ok ? `OK, answer = ${answer}` : `FAILED: ${error}`}</p>
    </div>
  );
}

export async function getServerSideProps() {
  // The ConfigSymbol / Container here come from [@demo/di-core inside the rspack bundle]
  // (@demo/di-core is not a direct dependency of app, so it can only be resolved up to the workspace root, and gets bundled)
  const container = new Container();
  container.bind(ConfigSymbol, { answer: 42 });

  // @demo/service is a direct dependency of app (there is a junction under packages/app/node_modules),
  // misjudged as external by rspack's NextExternalsPlugin (even though it is in transpilePackages),
  // loaded at runtime via Node require; the @demo/di-core it requires internally is a second instance on the Node side,
  // ServiceDeps[0] is not equal to the ConfigSymbol inside the bundle → resolution fails
  const dep = ServiceDeps[0];
  try {
    const config = container.get(dep);
    return { props: { ok: true, answer: config.answer } };
  } catch (e) {
    return { props: { ok: false, error: e.message } };
  }
}
