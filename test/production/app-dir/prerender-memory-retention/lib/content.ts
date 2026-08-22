import { PARAGRAPHS_PER_PAGE } from './config'

/**
 * Loads the content of one page, cached per slug, like the content loader of a
 * documentation site.
 */
export async function getContent(slug: string): Promise<string[]> {
  'use cache'

  return Array.from(
    { length: PARAGRAPHS_PER_PAGE },
    (_, index) =>
      `${slug} paragraph ${index}: ` + 'lorem ipsum dolor sit amet '.repeat(18)
  )
}
