import {headers} from "next/headers";

export async function generateMetadata({params}) {
    const {preventStaticRender} = await headers();
    await remoteDataFetch();
    throw new Error("This is an error");
}

export default async function ThrowMiscErrorPage({params, searchParams}) {
    return (
        <>This page throws a misc error</>
    )
}

function remoteDataFetch() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}