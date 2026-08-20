"use client";
import { useRef } from "react";
import { construct } from "./construct";

export default function Home() {
  const a = construct();
  const ref = useRef(a);
  const b = ref.current;

  return <p id="out">{b.test}</p>;
}
