// Copied from https://nextjs.org/docs/app/building-your-application/routing/internationalization
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

export default function getLocale(request, locales) {
  const { headers } = request // NextRequest#headers is a web Headers instance
  const languages = new Negotiator({ headers }).languages()
  console.log('[repro] negotiator languages =', JSON.stringify(languages))
  const defaultLocale = 'en'
  return match(languages, locales, defaultLocale)
}
