export async function generateMetadata({params}) {
    return {
        title: "Redirect destination",
    };
}

export default async function RedirectDestinationPage({params, searchParams}) {
    return (
        <>This page is the redirect destination</>
    )
}

