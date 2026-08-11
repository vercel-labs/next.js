"use client"

import { myAction } from "./actions"

export default function Page() {
  return <form action={myAction}><button>Go</button></form>
}
