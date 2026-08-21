export const dynamic = "force-static";

export async function GET(
  _: Request,
  {params: _params}: {params: Promise<{store: string; lang: string}>},
) {
  const {store, lang} = await _params;
  return new Response(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>http://example.com/${store}/${lang}</loc>
    </url>
    </urlset>
    `, {
    headers: {"Content-Type": "text/xml"},
  });
}
