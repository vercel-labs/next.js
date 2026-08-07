const map = { 'post-a': 'post-a/index.mdx' }
export function getFilePath(slug) {
  return map[slug]
}
