"use client"

import { useCallback } from "react"
import { Child } from "@/components/child"

export function Chat() {
  const resumeStream = useCallback(() => {
    console.log("resume")
  }, [])

  return <Child resumeStream={resumeStream} />
}
