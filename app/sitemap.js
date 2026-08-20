export default async function sitemap() {
  return [
    {
      url: 'http://localhost:3000/',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}
