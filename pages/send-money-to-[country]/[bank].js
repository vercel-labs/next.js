export default function Bank({q}){return <pre id="out">{JSON.stringify({page:'send-money-to-[country]/[bank]',q})}</pre>}
export function getServerSideProps(ctx){return {props:{q:ctx.query}}}
