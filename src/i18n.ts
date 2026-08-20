// A shared file that exports configuration as well as messages

// Imported into the middleware
export const COOKIE_NAME = 'NEXT_LOCALE';

// Currently not used anywhere and not should not be bundled by middleware
export async function getMessages(locale: string) {
  return (await import(`../messages/${locale}.json`)).default;
}
