import fs from "fs";
import type { GetStaticProps, GetStaticPaths } from "next";

const FLAG = "/tmp/notfound-flag";

export default function Post({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const notFound = fs.existsSync(FLAG);
  console.log(new Date().toISOString(), "getStaticProps", params?.slug, "notFound:", notFound);
  if (notFound) return { notFound: true, revalidate: 1 };
  return { props: { title: `Post ${params?.slug}` }, revalidate: 1 };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{ params: { slug: "1" } }],
  fallback: "blocking",
});
