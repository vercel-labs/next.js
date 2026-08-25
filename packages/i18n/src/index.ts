import en from './en'
import vi from './vi'

export type Locale = 'en' | 'vi'

const dictionaries = { en, vi } as const

export function getDictionary(locale: Locale) {
  return dictionaries[locale]
}

export const SUPPORTED_LOCALES: Locale[] = ['en', 'vi']