import variables from './vars.module.scss';

export default function Page() {
  return (
    <main>
      <p id="keys">keys: {JSON.stringify(Object.keys(variables))}</p>
      <p id="value">primaryColor: {String(variables.primaryColor)}</p>
      <h1 id="hdr" style={{ color: variables.primaryColor }}>
        Sass :export test
      </h1>
    </main>
  );
}
