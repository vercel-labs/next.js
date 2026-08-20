import Content, { frontmatter } from "@/content/post.mdx"

export default function PostPage() {
  console.log(frontmatter)
  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <Content />
    </div>
  )
}
