import { useRouter } from 'next/router';

// ids chosen because they are bloom-filter false positives for the
// default experimental.clientRouterFilter built from the app-router paths
const IDS = ['1', '3299'];

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <h1>home</h1>
      {IDS.map((id) => (
        <button
          key={id}
          id={`push-${id}`}
          onClick={() => {
            // same shape as the reporter's onSubmit/mutation callback
            Promise.resolve({ id }).then((data) => {
              console.log('before push', {
                basePath: router.basePath,
                asPath: router.asPath,
                target: `/cars/${data.id}`,
              });
              router.push(`/cars/${data.id}`);
            });
          }}
        >
          {`router.push("/cars/${id}")`}
        </button>
      ))}
    </main>
  );
}
