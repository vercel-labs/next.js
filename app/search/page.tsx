"use client";
import { useRouter } from "next/navigation"
import Navbar from "../Navbar"

export default function Search() {
  const router = useRouter();

  return (
    <div>
      <Navbar></Navbar>
      <br/>
      <button onClick={() => router.push('/search?name=ㄱㄴㄷㄹ')}>Move1</button>
      <button onClick={() => router.push('/search?name=' + encodeURIComponent('ㄱㄴㄷㄹ'))}>Move2</button>
    </div>
  )
}


