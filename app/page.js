import Link from "next/link";

export default function Page() {
  return (
    <main>
      <nav>
        <Link id="next-link" href="#target">
          next/link to #target
        </Link>
        {" | "}
        <a id="plain-anchor" href="#target">
          plain anchor to #target
        </a>
        {" | "}
        <button id="after-nav" type="button">
          button after nav
        </button>
      </nav>
      <div style={{ height: "150vh" }} />
      <section id="target" style={{ border: "1px solid" }}>
        <h2>Target section</h2>
        <button id="inside-target" type="button">
          button inside target
        </button>
      </section>
      <button id="after-target" type="button">
        button after target
      </button>
      <div style={{ height: "150vh" }} />
    </main>
  );
}
