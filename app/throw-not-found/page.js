import {notFound} from "next/navigation";
import {headers} from "next/headers";

export async function generateMetadata({params}) {
    const {preventStaticRender} = await headers();
    await remoteDataFetch();
    notFound();
    return {
        title: "This page throws notFound()",
    };
}

export default async function ThrowNotFoundPage({params, searchParams}) {
    return (
        <>This page throws notFound()</>
    )
}

function remoteDataFetch() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}