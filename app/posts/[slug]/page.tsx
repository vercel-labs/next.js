import { Suspense } from "react";
import { draftMode } from "next/headers";
import { connection } from "next/server";
import { cacheTag, cacheLife } from "next/cache";
import { notFound } from "next/navigation";

async function cachedPostData(slug: string) {
  "use cache";
  cacheTag("posts", `post:${slug}`);
  cacheLife("custom");

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`);
  const post = await res.json();

  return {
    title: post?.title ?? "Post not found",
    description: post?.body?.slice(0, 160) ?? "",
  };
}

async function DraftBanner({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { isEnabled: draftModeEnabled } = await draftMode();
  const isDraft = draftModeEnabled || resolvedSearchParams?.draft === "true";
  return isDraft ? <p style={{ color: "orange" }}>Draft mode is enabled</p> : null;
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ draft?: string }>;
}) {
  const { slug } = await params;
  const post = await cachedPostData(slug);
  if (!post) return notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <Suspense fallback={<div>loading draft state…</div>}>
        <DraftBanner searchParams={searchParams} />
      </Suspense>
    </article>
  );
}
