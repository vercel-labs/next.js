"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getToggle, setToggle } from "./actions"

export const Toggle = () => {
    const {refresh} = useRouter()
    const [clientToggle, setClientToggle] = useState(false)

    const refetchToggle = async () => {
        const toggle = await getToggle()
        setClientToggle(toggle)
        return toggle
    }

    useEffect(() => {
        refetchToggle()
    }, [])

    return (
        <div style={{position: "fixed", top: 16, right: 16}}>
            <button onClick={async () => {
                await setToggle(!clientToggle)
                const toggle = await refetchToggle()
                console.log("calling router.refresh, toggle will be", toggle)
                refresh()
            }}>Toggle {JSON.stringify(clientToggle)}</button>
        </div>
    )
}