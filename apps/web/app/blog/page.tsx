import { Card, Badge } from '@repo/ui'
import type { BlogPost } from '@repo/types'

const posts: BlogPost[] = Array.from({ length: 12 }, (_, i) => ({
  id: `post-${i}`, slug: `post-${i}`, title: `Post ${i}`, excerpt: `Excerpt ${i}`,
  content: `Content ${i} `.repeat(20), author: 'author', tags: ['tag1', 'tag2'], publishedAt: '2026-01-01',
}))

export default function Page() {
  return (
    <div>
      <h1>Blog</h1>
      {posts.map(p => (
        <Card key={p.id} title={p.title}>
          <p>{p.excerpt}</p>
          {p.tags.map(t => <Badge key={t} label={t} />)}
        </Card>
      ))}
    </div>
  )
}