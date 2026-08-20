import { GetStaticPropsContext } from "next";

export function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      segments: context.params?.segments,
    },
  };
}

export function getStaticPaths() {
  console.log("getStaticPaths");
  return {
    paths: ["/allowed-path"],
    fallback: false,
  };
}

export default function Page(props: unknown) {
  return (
    <div
      style={{
        maxWidth: "72ch",
        margin: "0 auto",
        textWrap: "pretty",
        fontFamily: "sans-serif",
        lineHeight: "1.5",
      }}
    >
      <h1>Incorrect Route Handling</h1>
      <p>
        You&apos;ve reached the catch-all route page, but this is likely
        unintended. IF you are at <code>/200</code> - this path should be
        proxied to httpstat.us instead of being handled here.
      </p>
      <p>Try refreshing the page! It will work as expected.</p>

      <p>Incoming props:</p>
      <pre
        style={{
          backgroundColor: "#f0f0f0",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  );
}
