# Repro: issue #53734 — dynamic segment shadows same-named query param (Pages Router)

    npm install && npm run dev
    curl "http://localhost:3000/my-path/test?param=123&other=abc"

Expected: `param` query value `123` available somewhere; actual: `useRouter().query.param === "test"`
and `getServerSideProps` `ctx.query.param === "test"` — the `?param=123` value is dropped entirely.
Unrelated query keys (`other=abc`) pass through fine.
