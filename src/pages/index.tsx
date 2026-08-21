import { api } from "~/utils/api";

export default function Home() {
  const hello = api.hello.useQuery({ name: "world" });

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>next-trpc-repro</h1>
      <p>
        Testing <code>GET /api/trpc/hello</code>
      </p>

      <section>
        <h2>Status</h2>
        {hello.isLoading && <p>Loading...</p>}
        {hello.isError && (
          <p style={{ color: "red" }}>
            Error: {hello.error.message}
            <br />
            HTTP status: {hello.error.data?.httpStatus}
            <br />
            Code: {hello.error.data?.code}
          </p>
        )}
        {hello.data && (
          <p style={{ color: "green" }}>
            Response: {JSON.stringify(hello.data)}
          </p>
        )}
      </section>

      <section>
        <h2>Bug description</h2>
        <p>
          On Vercel preview deployments with <strong>i18n</strong> (defaultLocale: pt-BR) +{" "}
          <strong>Clerk middleware via proxy.ts</strong> +{" "}
          <strong>matcher including /(api|trpc)(.*)</strong>, all tRPC routes
          return <code>404</code>.
        </p>
        <p>
          Vercel logs show:
          <br />
          <code>Middleware: 200</code> (middleware runs fine)
          <br />
          <code>Cache: 404 Not Found — Status: HIT — Key: /pt-BR/404</code>
          <br />
          The static i18n 404 page is served. The API route handler is never
          invoked.
        </p>
        <p>
          Works correctly when served via Vercel Instant Rollback to an older
          build. Fails on every new build/deployment.
        </p>
      </section>
    </main>
  );
}
