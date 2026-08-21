import {redirect} from "next/navigation";
import {headers} from "next/headers";

export async function generateMetadata({params}) {
    const {preventStaticRender} = await headers();
    await remoteDataFetch();
    redirect("/redirect-destination");
    return {
        title: "This page throws redirect()",
    };
}

export default async function ThrowRedirectPage({params, searchParams}) {
    return (
        <>This page throws redirect()</>
    )
}

function remoteDataFetch() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}