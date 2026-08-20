import { useRouter } from "next/router";

let hits = 0;

export const getServerSideProps = async ({ params, query }) => {
  hits += 1;
  await new Promise((r) => setTimeout(r, Number(query.delay ?? 700)));
  const url = params?.url.join("/");
  console.log(`[GSSP] hit #${hits} url=${url} page=${query.page ?? ""}`);
  return { props: { url, gsspHits: hits, gsspAt: Date.now(), page: query.page ?? null } };
};

export default function Categories({ url, gsspHits, gsspAt, page }) {
  const router = useRouter();
  const shallowReplace = () => {
    const next = Number(router.query.page || 1) + 1;
    const path = `/categories/${url}?page=${next}`;
    const style = router.query.style;
    if (style === "push") {
      router.push(
        { pathname: "/categories/[...url]", query: { url: url.split("/"), page: next, style } },
        path + `&style=push`,
        { scroll: false, shallow: true }
      );
    } else if (style === "string-as-undefined") {
      // reporter's real-world call shape: string href, no `as`
      router.replace(path, undefined, { scroll: false, shallow: true });
    } else if (style === "string") {
      router.replace(path, path, { scroll: false, shallow: true });
    } else {
      router.replace(
        { pathname: "/categories/[...url]", query: { url: url.split("/"), page: next, style } },
        path + (style ? `&style=${style}` : ""),
        { scroll: false, shallow: true }
      );
    }
  };

  return (
    <div>
      <h2 id="url">url: {url}</h2>
      <p id="hits">gsspHits: {gsspHits}</p>
      <p id="at">gsspAt: {gsspAt}</p>
      <p id="aspath">asPath: {router.asPath}</p>
      <button id="shallow" onClick={shallowReplace}>shallow replace page</button>
      <div>
        {["women/ready-to-wear.html", "women.html", "women/shoes.html"].map((item) => (
          <div key={item}>
            <button
              id={`go-${item}`}
              onClick={() =>
                router.push({ pathname: "/categories/[...url]", query: { url: item.split("/") } })
              }
            >
              go to {item}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
