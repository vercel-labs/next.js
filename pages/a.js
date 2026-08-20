import { getInstanceId, getEvalCount } from '../shared';
export function getServerSideProps() {
  return { props: { id: getInstanceId(), evals: getEvalCount() } };
}
export default function Page({ id, evals }) {
  return (
    <div>
      <h1>page a</h1>
      <p id="id">instanceId: {id}</p>
      <p id="evals">shared.js evaluations: {evals}</p>
    </div>
  );
}
