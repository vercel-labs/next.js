export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap/0.xml</loc></sitemap>
  <sitemap><loc>https://example.com/sitemap/1.xml</loc></sitemap>
</sitemapindex>`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
