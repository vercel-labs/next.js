export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
    return [];
}

export default async function Page({
    params,
}: {
    params: Promise<{ store: string; lang: string; slug: string }>;
}) {
    const { store, lang, slug } = await params;
    return (
        <div>
            <p>store: {store}</p>
            <p>lang: {lang}</p>
            <p>slug: {slug}</p>
        </div>
    );
}
