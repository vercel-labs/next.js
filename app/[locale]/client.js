'use client'
export default function Client({ action }) {
  return <button id="run" onClick={async () => { console.log(await action()) }}>run action</button>
}
