export default function Tx({q}){return <pre id="out">{JSON.stringify({page:'transactions/[id]',q})}</pre>}
export function getServerSideProps(ctx){return {props:{q:ctx.query}}}
