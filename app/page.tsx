"use client"

import { useEffect } from "react";

/** Add your relevant code here for the issue to reproduce */
export default function Home() {

  useEffect(()=>{
    console.error({ a: 1, b: 2 })
  },[])

  return null;
}
