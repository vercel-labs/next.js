'use client'
export default function RootError({ error, reset }) {
  return (<div id="root-error">ROOT app/error.js caught: {error.message}
    <button onClick={reset}>reset</button></div>)
}
