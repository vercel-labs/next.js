export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SearchPage = async () => {
    console.log('[server] rendering /search at', new Date().toISOString());
    const result = await new Promise<string>((resolve) =>
        setTimeout(() => resolve(Math.random().toString(36).substring(2)), 5000)
    );
    return <div>{result}</div>;
};

export default SearchPage;