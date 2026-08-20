'use client'
import Link from "next/link"
import { useEffect, useState } from "react";

let renders = 0
export default function Navbar(){
    renders++
    console.log('Navbar rendered', renders)
    if (typeof window !== 'undefined') (window).__navbarRenders = renders
    const [count, setCount] = useState(0)
    useEffect(() => {
        console.log('Navbar MOUNTED (effect with [] ran)')
        ;(window).__navbarMounts = ((window).__navbarMounts || 0) + 1
    }, [])
    return(
        <nav style={{display: 'flex', gap: '30px', margin: '20px'}}>
            <Link href="/">Homepage</Link>
            <Link href="/info">Info</Link>
            <button id="inc" onClick={() => setCount(c => c + 1)}>count: <span id="count">{count}</span></button>
        </nav>
    )
}
