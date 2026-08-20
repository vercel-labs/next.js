// Local mock of the Storyblok CDN so this reproduction does not depend on a live
// Storyblok space (the token in the original StackBlitz repro is dead).
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    story: {
      id: 12345,
      name: 'Home',
      slug: 'home',
      uuid: '00000000-0000-0000-0000-000000000001',
      content: {
        _uid: 'root-uid',
        component: 'page',
        body: [{ _uid: 'teaser-uid', component: 'teaser', headline: 'Hello from mock Storyblok' }],
      },
    },
    cv: 1,
    rels: [],
    links: [],
  });
}
