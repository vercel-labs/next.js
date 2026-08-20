export type PageParams = {
  slug: string
  title: string
  components: Array<{ name: string }>
}

export const allPages: PageParams[] = [
  { slug: 'about', title: 'About', components: [{ name: 'Carousel' }] },
  { slug: 'contact', title: 'Contact', components: [{ name: 'Accordion' }] },
]
