'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

export const Pathname: React.FC<{}> = () => {
    const pathname = usePathname()
    console.log({pathname}) // we log the pathname here to see it while building the app
    return <div>
        <p>The current pathname is: {pathname}</p>
        {pathname === '/bug' && <>
            <p>While building, the build process will build the /error page. It logs /error in our console as the current pathname<br /> We&#39;re getting an hydration error here because the generated html from /error is not matching /bug which was not prebuild with this url. Only /error was prebuild.</p>
            <p>Navigating directly to <Link href='/error' target='_blank'>/error</Link> however, is not causing an hydration error because /error is the destination target and this directory realy exists.</p>
        </>}
    </div>
}