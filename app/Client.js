"use client"
import { useState } from "react"
import { submitForm, doRedirect } from "./action"
import { label } from "./cjs-util"

export function Client() {
  const [msg, setMsg] = useState("idle")
  return (
    <div>
      <p id="msg">{msg}</p>
      <p>{label()}</p>
      <button id="action" onClick={async () => {
        try { setMsg(await submitForm()) } catch (e) { setMsg("ERROR: " + e.message) }
      }}>Run server action (revalidatePath)</button>
      <form id="form" action={async () => {
        try { await submitForm() } catch (e) { setMsg("ERROR: " + e.message) }
      }}><button id="formsubmit" type="submit">Submit form</button></form>
      <button id="redirect" onClick={async () => {
        try { await doRedirect() } catch (e) { setMsg("ERROR: " + e.message) }
      }}>Redirect action</button>
    </div>
  )
}
